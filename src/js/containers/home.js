import React from 'react'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'
import getVideoStream from '../lib/media'

const SWARM_NAME = 'p2p.chat'
const SIGNALHUB = 'https://tomjwatson-signalhub.herokuapp.com'

export default class Home extends React.Component {

  constructor() {
    super()

    this.state = {
      initialized: false,
      peerStreams: {},
    }
  }

  async componentDidMount() {
    this.init()
  }

  async init() {

    const videoStream = await getVideoStream()

    const hub = signalhub(SWARM_NAME, [SIGNALHUB])
    const sw = swarm(hub)

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

    this.setState({
      initialized: true,
      videoStream,
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

    // peer.on('data', (data) => {
    //   console.log('received data', JSON.parse(data.toString()))
    //   console.log('adding stream')
    //   peer.addStream(this.state.videoStream)
    // })
    // peer.send(JSON.stringify({test: 'hi'}))

    peer.addStream(this.state.videoStream)

  }

  handleDisconnect(peer, id) {

    console.log('disconnected from a peer:', id)

    const peerStreams = Object.assign({}, this.state.peerStreams)
    delete peerStreams[id]
    this.setState({peerStreams})

  }

  render() {

    const {initialized, videoStream, peerStreams} = this.state

    if (!initialized) {
      return <h1>Initializing...</h1>
    }

    return (
      <div>
        <video src={URL.createObjectURL(videoStream)} autoPlay />
        <hr />
        {
          Object.keys(peerStreams).map((id) => {
            return (
              <video key={id} src={URL.createObjectURL(peerStreams[id])} autoPlay />
            )
          })
        }
      </div>
    )

  }

}
