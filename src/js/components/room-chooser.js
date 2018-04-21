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

    const {onChooseRoom} = this.props
    const {roomValue} = this.state

    if (evt.key === 'Enter') {
      onChooseRoom(roomValue)
    }

  }

  render() {

    const {onChooseRoom} = this.props
    const {roomValue} = this.state

    return (
      <div>
        <input
          value={this.state.roomValue}
          onChange={evt => this.onChange(evt)}
          onKeyPress={evt => this.onKeyPress(evt)}
        />
        <button type='button' onClick={() => onChooseRoom(roomValue)}>
          Create/Join Room
        </button>
      </div>
    )

  }

}
