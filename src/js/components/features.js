import React from 'react'
import {Shield, Users, Lock} from 'react-feather'

export default (props) => {

  return (
    <div className='features'>
      <div className='container'>
        <h3>Features</h3>
        <div className='row'>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>Unique, secure rooms</div>
              <Shield size={35} />
              <div className='feature-text'>Rooms are generated with a unique encrypted hash, making room links effectively unguessable.</div>
            </div>
          </div>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>No limit on room size</div>
              <Users size={35} />
              <div className='feature-text'>Invite as many people to the room as you want. The only limits are screen size and connection quality.</div>
            </div>
          </div>
          <div className='four columns'>
            <div className='feature'>
              <div className='feature-title'>End-to-end encryption</div>
              <Lock size={35} />
              <div className='feature-text'>All video, audio and data is sent via an end-to-end encrypted connection using WebRTC.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}
