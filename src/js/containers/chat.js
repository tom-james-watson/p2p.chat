import React from 'react'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'
import getVideoStream from '../lib/media'
import MyStream from '../components/my-stream'

const SWARM_NAME = 'p2p.chat-two'
const SIGNALHUB = 'https://tomjwatson-signalhub.herokuapp.com'

export default class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      peerStreams: {},
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

  render() {

    const {myStream, peerStreams} = this.state

    if (!myStream) {
      return <h1>Initializing...</h1>
    }

    return (
      <div>
        <MyStream stream={myStream} />
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
