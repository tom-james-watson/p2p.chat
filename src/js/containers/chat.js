import React from 'react'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'

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

    console.log('chat did mount')

    const {room} = this.props

    const hub = signalhub(room, [SIGNALHUB])
    const sw = swarm(hub)

    sw.on('peer', this.handleConnect.bind(this))

    sw.on('disconnect', this.handleDisconnect.bind(this))

    this.setState({
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
    //   peer.addStream(this.state.myStream)
    // })
    // peer.send(JSON.stringify({test: 'hi'}))

    peer.addStream(this.props.myStream)

  }

  handleDisconnect(peer, id) {

    console.log('disconnected from a peer:', id)

    const peerStreams = Object.assign({}, this.state.peerStreams)
    delete peerStreams[id]
    this.setState({peerStreams})

  }

  render() {

    const {peerStreams} = this.state

    return (
      <div>
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
