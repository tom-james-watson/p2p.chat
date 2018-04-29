import React from 'react'
import {Loader} from 'react-feather';
import CopyLink from './copy-link'

export default (props) => {

  return (
    <div id='initializing-swarm' className='hero container'>
      <h3>Connecting...</h3>
      <Loader size={48} className='spinner' />
    </div>
  )

}
