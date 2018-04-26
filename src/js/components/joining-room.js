import React from 'react'

export default (props) => {

  const {roomName} = props

  return (
    <div id='hero' className='container'>
      <h3>Joining {roomName}...</h3>
    </div>
  )

}
