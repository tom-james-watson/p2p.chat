import React from 'react'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'
import getVideoStream from '../lib/media'
import MyStream from '../components/my-stream'
import PeerStreams from '../components/peer-streams'

const SIGNALHUB = 'https://tomjwatson-signalhub.herokuapp.com'

export default class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      peerStreams: {},
      roomTitle: props.room.split('/')[1],
      audioOn: true,
      videoOn: true,
    }
  }

  async componentDidMount() {

    const myStream = await getVideoStream()

    const {room} = this.props

    const hub = signalhub(room, [SIGNALHUB])
    const sw = swarm(hub)

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

    this.setState({
      myStream,
      sw
    })

  }

  handleConnect(peer, id) {

    console.log('connected to a new peer:', {id})

    peer.on('stream', (stream) => {
      const peerStreams = Object.assign({}, this.state.peerStreams)
      console.log('received stream', {id, stream})
      peerStreams[id] = stream
      this.setState({peerStreams})
    })

    peer.addStream(this.state.myStream)

  }

  handleDisconnect(peer, id) {

    console.log('disconnected from a peer:', id)

    const peerStreams = Object.assign({}, this.state.peerStreams)
    delete peerStreams[id]
    this.setState({peerStreams})

  }

  async getMyStream() {

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

    const {roomTitle, myStream, peerStreams, audioOn, videoOn} = this.state

    if (!myStream) {
      return (
        <div id='hero' className='container'>
          <h3>Joining {roomTitle}...</h3>
        </div>
      )
    }

    return (
      <div id='chat'>
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
