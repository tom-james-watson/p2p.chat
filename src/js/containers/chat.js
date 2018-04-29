import React from 'react'
import swarm from 'webrtc-swarm'
import uuidv4 from 'uuid/v4'
import signalhub from 'signalhub'
import {decodeRoom} from '../lib/room-encoding'
import getVideoStream from '../lib/media'
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
    }

  }

  async handleRequestPerms() {

    const myStream = await getVideoStream()

    this.setState({myStream})

  }

  async handleSetNickname(nickname) {

    this.setState({
      nickname
    })

    this.connectToSwarm()

  }

  connectToSwarm() {

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
          outgoingSignalingData.fromNickname = this.state.nickname
          return outgoingSignalingData
        },
      }
    )

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

  }

  handleHubData(message) {

    const {swarmInitialized, myUuid} = this.state

    if (!swarmInitialized) {
      this.setState({swarmInitialized: true})
    }

    if (message.type === 'connect' && message.from !== myUuid) {

      console.info('connecting to', {uuid: message.from, nickname: message.fromNickname})

    }

  }

  handleConnect(peer, id) {

    const {nickname} = this.state

    console.info('connected to a new peer:', {id})

    const peerStreams = Object.assign({}, this.state.peerStreams)
    peerStreams[id] = {}
    this.setState({peerStreams})

    peer.on('stream', (stream) => {
      const peerStreams = Object.assign({}, this.state.peerStreams)
      console.info('received stream', {id, stream})
      peerStreams[id].stream = stream
      this.setState({peerStreams})
    })

    peer.on('data', (payload) => {

      const data = JSON.parse(payload.toString())

      console.info('received data', {id, data})

      if (data.type === 'receivedHandshake') {
        peer.addStream(this.state.myStream)
      }

      if (data.type === 'sendHandshake') {
        const peerStreams = Object.assign({}, this.state.peerStreams)
        peerStreams[id].nickname = data.nickname
        peer.send(JSON.stringify({type: 'receivedHandshake'}))
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
    delete peerStreams[id]
    this.setState({peerStreams})

  }

  render() {

    const {created} = this.props
    const {nickname, invalidRoom, roomName, myStream, swarmInitialized, peerStreams} = this.state

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
              expanded={!swarmInitialized || awaitingPeers}
            />
          ) : null
        }
      </div>
    )

  }

}
