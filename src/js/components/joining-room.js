import React from 'react'

export default (props) => {

  const {roomName} = props

  return (
    <div className='hero container'>
      <h3>Joining {roomName}...</h3>
    </div>
  )

}
