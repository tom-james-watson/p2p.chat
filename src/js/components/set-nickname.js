import React from 'react'
import {encodeRoom} from '../lib/room-encoding'

export default class SetNickname extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      nickname: '',
    }

  }

  onChange(evt) {

    this.setState({
      nickname: evt.target.value
    });

  }

  onSetNickname(nickname) {

    const {onSetNickname} = this.props

    nickname = nickname.replace(/\s\s+/g, ' ')
    nickname = nickname.trim()

    onSetNickname(nickname)

  }

  render() {

    const {roomName, created} = this.props
    const {nickname} = this.state

    return (
      <div id='set-nickname' className='container'>
        <h3>{created ? 'Creating ' : null}{roomName}</h3>
        <h5>Set a nickname:</h5>
        <form onSubmit={(e) => {e.preventDefault(); this.onSetNickname(nickname)}}>
          <div>
            <input
              type='text'
              placeholder='e.g. tom'
              value={this.state.roomValue}
              onChange={evt => this.onChange(evt)}
              required
              minLength='3'
            />
          </div>
          <div>
            <button
              type='submit'
              className='button-primary'
            >
              Join Video Call
            </button>
          </div>
        </form>
      </div>
    )

  }

}
