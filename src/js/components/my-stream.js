import React from 'react'

export default function(props) {

  const {stream} = props

  return (
    <div>
      <video src={URL.createObjectURL(stream)} autoPlay muted />
    </div>
  )

}
