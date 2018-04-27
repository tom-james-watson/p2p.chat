import React from 'react'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'
import {decodeRoom} from '../lib/room-encoding'
import getVideoStream from '../lib/media'
import ChatHeader from '../components/chat-header'
import MyStream from '../components/my-stream'
import PeerStreams from '../components/peer-streams'
import InvalidRoom from '../components/invalid-room'
import JoiningRoom from '../components/joining-room'

const SIGNALHUB = 'https://tomjwatson-signalhub.herokuapp.com'

export default class Home extends React.Component {

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
      audioOn: true,
      videoOn: true,
    }
  }

  async componentDidMount() {

    const {invalidRoom} = this.state
    const {roomCode} = this.props

    if (invalidRoom) {
      return
    }

    const myStream = await getVideoStream()

    const hub = signalhub(roomCode, [SIGNALHUB])
    const sw = swarm(hub)

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

    this.setState({
      myStream,
      sw
    })

  }

  handleConnect(peer, id) {

    console.info('connected to a new peer:', {id})

    peer.on('stream', (stream) => {
      const peerStreams = Object.assign({}, this.state.peerStreams)
      console.info('received stream', {id, stream})
      peerStreams[id] = stream
      this.setState({peerStreams})
    })

    peer.addStream(this.state.myStream)

  }

  handleDisconnect(peer, id) {

    console.info('disconnected from a peer:', id)

    const peerStreams = Object.assign({}, this.state.peerStreams)
    delete peerStreams[id]
    this.setState({peerStreams})

  }

  handleVideoToggle() {

    const {myStream, videoOn} = this.state

    myStream.getVideoTracks()[0].enabled = !videoOn

    this.setState({
      videoOn: !videoOn
    })

  }

  handleAudioToggle() {

    const {myStream, audioOn} = this.state

    myStream.getAudioTracks()[0].enabled = !audioOn

    this.setState({
      audioOn: !audioOn
    })

  }

  render() {

    const {invalidRoom, roomName, myStream, peerStreams, audioOn, videoOn} = this.state

    if (invalidRoom) {
      return (
        <InvalidRoom />
      )
    }

    if (!myStream) {
      return (
        <JoiningRoom roomName={roomName} />
      )
    }

    return (
      <div id='chat'>
        <ChatHeader roomName={roomName} />
        <PeerStreams peerStreams={peerStreams} />
        <MyStream
          stream={myStream}
          audioOn={audioOn}
          onAudioToggle={this.handleAudioToggle.bind(this)}
          onVideoToggle={this.handleVideoToggle.bind(this)}
          videoOn={videoOn}
        />
      </div>
    )

  }

}
