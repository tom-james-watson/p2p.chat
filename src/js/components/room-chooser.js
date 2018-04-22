import React from 'react'

export default class RoomChoose extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      roomValue: '',
    }

  }

  onChange(evt) {

    this.setState({
      roomValue: evt.target.value
    });

  }

  onKeyPress(evt) {

    const {roomValue} = this.state

    if (evt.key === 'Enter') {
      this.onChooseRoom(roomValue)
    }

  }

  onChooseRoom(room) {

    const {onChooseRoom} = this.props

    const sid = (+new Date).toString(36).slice(-5)
    const slug = this.slugify(room)
    const uniqueRoom = `${sid}-${slug}`

    onChooseRoom(uniqueRoom)

  }

  slugify(text) {

    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-')   // Replace multiple - with single -
      .replace(/^-+/, '')       // Trim - from start of text
      .replace(/-+$/, '');      // Trim - from end of text

  }

  render() {

    const {roomValue} = this.state

    return (
      <div id='room-chooser' className='container'>
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
            onClick={() => this.onChooseRoom(roomValue)}
          >
            Create Room
          </button>
        </div>
      </div>
    )

  }

}
