import React from 'react'
import CopyLink from './copy-link'

export default (props) => {

  return (
    <div id='awaiting-peers' className='hero container'>
      <h3>Waiting for peers...</h3>
      <p>Share the link to start a video call</p>
      <CopyLink />
    </div>
  )

}
