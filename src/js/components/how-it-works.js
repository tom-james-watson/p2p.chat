import React from 'react'
import {PlusSquare, Send, Video} from 'react-feather'

export default (props) => {

  return (
    <div id='how-it-works'>
      <div className='container'>
        <h3>How it works</h3>
        <div className='row'>
          <div className='four columns'>
            <div className='how'>
              <div className='how-title'>Create a room.</div>
              <PlusSquare size={35} />
              <div className='how-text'>Rooms are generated with a unique encrypted hash, making room links effectively unguessable.</div>
            </div>
          </div>
          <div className='four columns'>
            <div className='how'>
              <div className='how-title'>Share the link.</div>
              <Send size={35} />
              <div className='how-text'>Send the link to your guests via email, chat, or any other means. </div>
            </div>
          </div>
          <div className='four columns'>
            <div className='how'>
              <div className='how-title'>Chat!</div>
              <Video size={35} />
              <div className='how-text'>Chat to your guests over a secure, encrypted, peer-to-peer connection.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}
