import React from 'react'
import swarm from 'webrtc-swarm'
import uuidv4 from 'uuid/v4'
import signalhub from 'signalhub'
import {decodeRoom} from '../lib/room-encoding'
import getMyStream from '../lib/media'
import ChatHeader from '../components/chat-header'
import MyStream from '../components/my-stream'
import PeerStreams from '../components/peer-streams'
import InvalidRoom from '../components/invalid-room'
import RequestPerms from '../components/request-perms'
import SetNickname from '../components/set-nickname'

const SIGNALHUB = 'https://signalhub.p2p.chat'

export default class Chat extends React.Component {

  constructor(props) {

    super(props)

    let roomName
    let invalidRoom = false

    try {
      roomName = decodeRoom(props.roomCode)
    } catch(e) {
      invalidRoom = true
    }

    this.state = {
      roomName,
      invalidRoom,
      peerStreams: {},
      swarmInitialized: false,
      myUuid: uuidv4(),
      audioOn: true,
      videoOn: true,
    }

  }

  async handleRequestPerms() {

    const {myStream, audioOn, videoOn} = await getMyStream()

    this.setState({myStream, audioOn, videoOn})

  }

  async handleSetNickname(nickname) {

    this.setState({
      nickname
    })

    this.connectToSwarm(nickname)

  }

  connectToSwarm(nickname) {

    const {myUuid} = this.state
    const {roomCode} = this.props

    const hub = signalhub(roomCode, [SIGNALHUB])

    hub.subscribe('all').on('data', this.handleHubData.bind(this))

    const sw = swarm(
      hub,
      {
        config: { iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ] },
        uuid: myUuid,
        wrap: (outgoingSignalingData, destinationSignalhubChannel) => {
          outgoingSignalingData.fromNickname = nickname
          return outgoingSignalingData
        },
      }
    )

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

    // Send initial connect signal
    hub.broadcast(
      roomCode,
      {
        type: 'connect',
        from: myUuid,
        fromNickname: nickname
      }
    )

  }

  handleHubData(message) {

    const {swarmInitialized, myUuid, peerStreams} = this.state

    if (!swarmInitialized) {
      this.setState({swarmInitialized: true})
    }

    if (message.type === 'connect' && message.from !== myUuid) {

      if (!peerStreams[message.from]) {

        console.info('connecting to', {uuid: message.from, nickname: message.fromNickname})

        // Add the peer to the peerStreams with just his nickname so we can
        // show a placeholder whilst the peers finish handshaking
        const newPeerStreams = Object.assign({}, peerStreams)
        newPeerStreams[message.from] = {nickname: message.fromNickname}
        this.setState({peerStreams: newPeerStreams})

        // If the peers never successfully finish handshaking and share
        // streams, clear up the peer
        setTimeout(() => {
          const {peerStreams} = this.state
          const newPeerStreams = Object.assign({}, peerStreams)

          if (peerStreams[message.from] && !peerStreams[message.from].stream) {
            delete newPeerStreams[message.from]
            this.setState({peerStreams: newPeerStreams})
          }
        }, 20000)

      }

    }

  }

  handleConnect(peer, id) {

    const {nickname} = this.state

    console.info('connected to a new peer:', {id})

    const peerStreams = Object.assign({}, this.state.peerStreams)
    peerStreams[id] = Object.assign({}, peerStreams[id], {
      peer,
      audioOn: true,
      videoOn: true,
    })
    this.setState({peerStreams})

    peer.on('stream', (stream) => {
      const peerStreams = Object.assign({}, this.state.peerStreams)
      console.info('received stream', {id, stream})
      peerStreams[id].stream = stream
      this.setState({peerStreams})
    })

    peer.on('data', (payload) => {

      const {myStream, audioOn, videoOn} = this.state

      const data = JSON.parse(payload.toString())

      console.info('received data', {id, data})

      if (data.type === 'receivedHandshake') {
        if (myStream) {
          peer.addStream(myStream)
        }
        if (!audioOn) {
          peer.send(JSON.stringify({type: 'audioToggle', enabled: false}))
        }
        if (!videoOn) {
          peer.send(JSON.stringify({type: 'videoToggle', enabled: false}))
        }
      }

      if (data.type === 'sendHandshake') {
        const peerStreams = Object.assign({}, this.state.peerStreams)
        peerStreams[id].nickname = data.nickname
        peer.send(JSON.stringify({type: 'receivedHandshake'}))
        this.setState({peerStreams})
      }

      if (data.type === 'audioToggle') {
        const peerStreams = Object.assign({}, this.state.peerStreams)
        peerStreams[id].audioOn = data.enabled
        this.setState({peerStreams})
      }

      if (data.type === 'videoToggle') {
        const peerStreams = Object.assign({}, this.state.peerStreams)
        peerStreams[id].videoOn = data.enabled
        this.setState({peerStreams})
      }

    })

    peer.send(JSON.stringify({
      type: 'sendHandshake',
      nickname,
    }))

  }

  handleDisconnect(peer, id) {

    console.info('disconnected from a peer:', id)

    const peerStreams = Object.assign({}, this.state.peerStreams)

    if (peerStreams[id] && peerStreams[id].stream) {
      delete peerStreams[id]
      this.setState({peerStreams})
    }

  }

  handleVideoToggle() {

    const {peerStreams, myStream, videoOn} = this.state

    myStream.getVideoTracks()[0].enabled = !videoOn

    for (const id of Object.keys(peerStreams)) {
      const peerStream = peerStreams[id]
      peerStream.peer.send(JSON.stringify({type: 'videoToggle', enabled: !videoOn}))
    }

    this.setState({
      videoOn: !videoOn
    })

  }

  handleAudioToggle() {

    const {peerStreams, myStream, audioOn} = this.state

    myStream.getAudioTracks()[0].enabled = !audioOn

    for (const id of Object.keys(peerStreams)) {
      const peerStream = peerStreams[id]
      peerStream.peer.send(JSON.stringify({type: 'audioToggle', enabled: !audioOn}))
    }

    this.setState({
      audioOn: !audioOn
    })

  }

  handleHangUp() {

    window.location = `${window.location.origin}/goodbye`

  }

  render() {

    const {created} = this.props
    const {
      nickname, invalidRoom, roomName, myStream, swarmInitialized, peerStreams,
      audioOn, videoOn
    } = this.state

    if (invalidRoom) {
      return <InvalidRoom />
    }

    if (!myStream) {
      return (
        <RequestPerms
          roomName={roomName}
          created={created}
          onRequestPerms={this.handleRequestPerms.bind(this)}
        />
      )
    }

    const awaitingPeers = Object.keys(peerStreams).length === 0

    return (
      <div id='chat'>
        {
          !myStream && !nickname ? (
            <RequestPerms
              roomName={roomName}
              created={created}
              onRequestPerms={this.handleRequestPerms.bind(this)}
            />
          ) : null
        }
        {
          myStream && !nickname ? (
            <SetNickname
              roomName={roomName}
              created={created}
              onSetNickname={this.handleSetNickname.bind(this)}
            />
          ) : null
        }
        {
          nickname && myStream ? (
            <ChatHeader roomName={roomName} />
          ) : null
        }
        {
          nickname && myStream ? (
            <PeerStreams
              peerStreams={peerStreams}
              swarmInitialized={swarmInitialized}
              shrunk={!swarmInitialized || awaitingPeers}
            />
          ) : null
        }
        {
          myStream ? (
            <MyStream
              stream={myStream}
              audioOn={audioOn}
              videoOn={videoOn}
              handleAudioToggle={this.handleAudioToggle.bind(this)}
              handleVideoToggle={this.handleVideoToggle.bind(this)}
              handleHangUp={this.handleHangUp.bind(this)}
              expanded={!swarmInitialized || awaitingPeers}
            />
          ) : null
        }
      </div>
    )

  }

}
