import React from 'react'
import LoadingIndicator from './loading-indicator'

export default (props) => {

  return (
    <div id='initializing-swarm' className='hero container'>
      <LoadingIndicator>Connecting</LoadingIndicator>
    </div>
  )

}
