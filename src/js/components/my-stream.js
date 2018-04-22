import React from 'react'
import classNames from 'classnames'
import { Mic, MicOff, Video, VideoOff } from 'react-feather';

export default function(props) {

  const {stream, videoOn, onVideoToggle, audioOn, onAudioToggle} = props

  const videoClassNames = classNames('button-primary control', {
    on: videoOn
  })
  const audioClassNames = classNames('button-primary control', {
    on: audioOn
  })

  return (
    <div id="my-stream">
      <div>
        <button className={videoClassNames} onClick={onVideoToggle}>
          { videoOn ? <Video /> : <VideoOff /> }
        </button>
      </div>
      <video id="my-video" src={URL.createObjectURL(stream)} autoPlay muted />
      <div>
        <button className={audioClassNames} onClick={onAudioToggle}>
          { audioOn ? <Mic /> : <MicOff /> }
        </button>
      </div>
    </div>
  )

}
