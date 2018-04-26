import React from 'react'
import {encodeRoom} from '../lib/room-encoding'

export default class CreateRoom extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      roomValue: '',
    }

  }

  onChange(evt) {

    this.setState({
      roomValue: this.slugify(evt.target.value)
    });

  }

  onKeyPress(evt) {

    const {roomValue} = this.state

    if (evt.key === 'Enter') {
      this.onCreateRoom(roomValue)
    }

  }

  onCreateRoom(text) {

    const {onCreateRoom} = this.props

    const roomName = this.cleanSlug(text)

    const roomCode = encodeRoom(roomName)

    onCreateRoom(roomCode)

  }

  slugify(text) {

    return text
      .replace(/[^-a-zA-Z0-9\s+]+/ig, '') // Remove all non-word chars
      .replace(/\s+/gi, "-") // Replace all spaces with dashes
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .toLowerCase()

  }

  cleanSlug(text) {

    return text
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text

  }

  render() {

    const {roomValue} = this.state

    return (
      <div id='create-room' className='container'>
        <div>
          <input
            type='text'
            placeholder='e.g. engineering standup'
            value={this.state.roomValue}
            onChange={evt => this.onChange(evt)}
            onKeyPress={evt => this.onKeyPress(evt)}
          />
          <button
            type='button'
            className='button-primary'
            onClick={() => this.onCreateRoom(roomValue)}
          >
            Create Room
          </button>
        </div>
      </div>
    )

  }

}
