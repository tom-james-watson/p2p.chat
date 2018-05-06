import React from 'react'
import classNames from 'classnames'
import {Mic, MicOff, X, Video, VideoOff} from 'react-feather';

export default function(props) {

  const {
    stream, audioOn, videoOn, handleHangUp, handleVideoToggle,
    handleAudioToggle, expanded
  } = props

  const videoClassNames = classNames('button-primary control', {
    on: videoOn
  })
  const audioClassNames = classNames('button-primary control', {
    on: audioOn
  })
  const myStreamClassNames = classNames({expanded})

  return (
    <div id='my-stream' className={myStreamClassNames}>
      <video id='my-video' src={URL.createObjectURL(stream)} autoPlay muted />
      <div id='controls'>
        <button className={videoClassNames} onClick={handleVideoToggle}>
          { videoOn ? <Video /> : <VideoOff /> }
        </button>
        <button id='hang-up' className='button-primary control' onClick={handleHangUp}>
          <X />
        </button>
        <button className={audioClassNames} onClick={handleAudioToggle}>
          { audioOn ? <Mic /> : <MicOff /> }
        </button>
      </div>
    </div>
  )

}
