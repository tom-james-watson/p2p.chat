import React from 'react'
import getVideoStream from '../lib/media'
import MyStream from '../components/my-stream'
import RoomChooser from '../components/room-chooser'
import Chat from './chat'

export default class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }


  async componentDidMount() {

    const myStream = await getVideoStream()

    this.setState({
      myStream,
    })

  }

  handleChooseRoom(room) {

    console.log('home handleChooseRoom', {room})

    this.setState({
      room,
    })

  }

  render() {

    const {myStream, room} = this.state

    if (!myStream) {
      return <h1>Initializing...</h1>
    }

    return (
      <div>
        <MyStream stream={myStream} />
        {
          room ? (
            <Chat myStream={myStream} room={room} />
          ) : (
            <RoomChooser onChooseRoom={this.handleChooseRoom.bind(this)} />
          )
        }
      </div>
    )

  }

}
