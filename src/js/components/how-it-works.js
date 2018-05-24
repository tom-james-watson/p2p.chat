import React from 'react'
import {PlusSquare, Send, Video} from 'react-feather'

export default (props) => {

  return (
    <div className='features how-it-works'>
      <div className='container'>
        <h3>How it works</h3>
        <div className='row'>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>Create a room</div>
              <PlusSquare size={35} />
              <div className='feature-text'>Choose a human-readable room name, such as the purpose of the meeting.</div>
            </div>
          </div>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>Share the link</div>
              <Send size={35} />
              <div className='feature-text'>Send the link to your guests via email, chat, or any other means.</div>
            </div>
          </div>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>Chat!</div>
              <Video size={35} />
              <div className='feature-text'>Chat to your guests over a secure, encrypted, peer-to-peer connection.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}
