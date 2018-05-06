import React from 'react'
import classNames from 'classnames'
import Controls from './controls';
import MyVideo from './my-video';

export default function(props) {

  const {
    stream, audioOn, videoOn, handleHangUp, handleVideoToggle,
    handleAudioToggle, expanded
  } = props

  const myStreamClassNames = classNames({expanded})

  return (
    <div id='my-stream' className={myStreamClassNames}>
      <MyVideo stream={stream} />
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
