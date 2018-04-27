import React from 'react'
import CopyLink from './copy-link'

export default (props) => {

  const {onCopy} = props

  return (
    <div id='awaiting-peers' className='hero container'>
      <h3>Searching for peers...</h3>
      <p>Invite to start a video call</p>
      <CopyLink />
    </div>
  )

}
