import React from 'react'
import queryString from 'query-string'
import Chat from './chat'
import RoomChooser from '../components/room-chooser'
import Hero from '../components/hero'

export default class Home extends React.Component {

  constructor(props) {

    super(props)

    const queryParams = queryString.parse(location.search)

    this.state = {
      room: queryParams.room
    }

  }

  handleChooseRoom(room) {

    // As we have no router, just do a full navigate - we'll pick up the room
    // from query params on load
    window.location = `${window.location.href}?room=${room}`

  }

  render() {

    const {room} = this.state

    if (room) {
      return <Chat room={room} />
    }

    return (
      <div id='home'>
        <Hero />
        <RoomChooser onChooseRoom={this.handleChooseRoom.bind(this)} />
      </div>
    )

  }

}
