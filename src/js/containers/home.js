import React from 'react'
import queryString from 'query-string'
import Chat from './chat'
import CreateRoom from '../components/create-room'
import Hero from '../components/hero'
import Social from '../components/social'

export default class Home extends React.Component {

  constructor(props) {

    super(props)

    const queryParams = queryString.parse(window.location.search)

    this.state = {
      roomCode: queryParams.room
    }

  }

  handleCreateRoom(roomCode) {

    // As we have no router, just do a full navigate - we'll pick up the room
    // from query params on load
    window.location = `${window.location.href}?room=${roomCode}`

  }

  render() {

    const {roomCode} = this.state

    if (roomCode) {
      return <Chat roomCode={roomCode} />
    }

    return (
      <div id='home'>
        <Hero />
        <CreateRoom onCreateRoom={this.handleCreateRoom.bind(this)} />
        <Social />
      </div>
    )

  }

}
