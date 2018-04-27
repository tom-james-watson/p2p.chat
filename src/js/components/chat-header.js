import React from 'react'
import CopyLink from './copy-link'

export default (props) => {

  const {roomName, onCopy} = props

  return (
    <div id='chat-header'>
      <span>{roomName}</span>
      <CopyLink />
    </div>
  )

}
