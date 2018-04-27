import React from 'react'

export default (props) => {

  const {roomName, onRequestPerms} = props

  return (
    <div className='hero container'>
      <h3>{roomName}</h3>
      <h5>You are about to join a video call.</h5>
      <button
        type='button'
        className='button-primary'
        onClick={onRequestPerms}
      >
        Allow cam/mic access
      </button>
    </div>
  )

}
