import React from 'react'
import classNames from 'classnames'
import Controls from './controls';

export default function(props) {

  const {
    stream, audioOn, videoOn, handleHangUp, handleVideoToggle,
    handleAudioToggle, expanded
  } = props

  const myStreamClassNames = classNames({expanded})

  return (
    <div id='my-stream' className={myStreamClassNames}>
      <video id='my-video' src={URL.createObjectURL(stream)} autoPlay muted />
      <Controls
        audioOn={audioOn}
        videoOn={videoOn}
        handleAudioToggle={handleAudioToggle}
        handleVideoToggle={handleVideoToggle}
        handleHangUp={handleHangUp}
      />
    </div>
  )

}
