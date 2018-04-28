import React from 'react'
import queryString from 'query-string'
import Chat from './chat'
import CreateRoom from '../components/create-room'
import Hero from '../components/hero'
import Social from '../components/social'
import NotFound from '../components/not-found'

export default class Home extends React.Component {

  constructor(props) {

    super(props)

    const pathname = window.location.pathname

    // We are rewriting all routes through to the index, but we can grab the
    // intended route from the URL.

    if (/^\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/.test(pathname)) {
      // Paths that match this are valid room codes.
      const roomCode = pathname.slice(1)

      // If we created the room ourselves, there'll be a ?created=true
      const queryParams = queryString.parse(window.location.search)
      const created = queryParams.created

      // Clean params from URL
      window.history.replaceState(null, null, `${window.location.origin}${pathname}`)

      this.state = {
        route: 'chat',
        roomCode,
        created
      }
    } else if (pathname === '/') {
      this.state = {
        route: 'home'
      }
    } else {
      this.state = {
        route: '404'
      }
    }

  }

  handleCreateRoom(roomCode) {

    // As we have no router, just do a full navigate - we'll pick up the room
    // from the url on load.
    window.location = `${window.location.origin}/${roomCode}?created=true`

  }

  renderHome() {
    return (
      <div id='home'>
        <Hero />
        <CreateRoom onCreateRoom={this.handleCreateRoom.bind(this)} />
        <Social />
      </div>
    )
  }

  renderChat() {
    const {roomCode, created} = this.state
    return <Chat roomCode={roomCode} created={created} />
  }

  render404() {
    return <NotFound />
  }

  render() {

    const {route} = this.state

    const pages = {
      'home': this.renderHome,
      'chat': this.renderChat,
      '404': this.render404,
    }

    return pages[route].bind(this)()

  }

}
