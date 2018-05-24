import React from 'react'
import classNames from 'classnames'
import {Mic, MicOff, X, Video, VideoOff} from 'react-feather';

export default class Controls extends React.Component {

  constructor(props) {

    super(props)

    window.addEventListener('mousemove', this.handleInteraction.bind(this))
    window.addEventListener('touchstart', this.handleInteraction.bind(this))

    this.state = {
      showControls: true
    }

  }

  componentDidMount() {

    this.handleInteraction()

  }

  handleInteraction() {

    const {interactionTimeoutHandle} = this.state

    clearTimeout(interactionTimeoutHandle)

    const timeoutHandle = setTimeout(() => {
      this.setState({
        showControls: false,
        interactionTimeoutHandle: null
      })
    }, 3000)

    this.setState({
      showControls: true,
      interactionTimeoutHandle: timeoutHandle
    })

  }

  render() {

    const {
      audioOn, videoOn, audioEnabled, videoEnabled, handleHangUp,
      handleVideoToggle, handleAudioToggle
    } = this.props
    const {showControls} = this.state

    const videoClassNames = classNames('button-primary control', {
      on: videoOn
    })
    const audioClassNames = classNames('button-primary control', {
      on: audioOn
    })
    const controlsClassNames = classNames({shown: showControls})

    return (
      <div id='controls' className={controlsClassNames}>
        <button className={videoClassNames} onClick={handleVideoToggle} disabled={!videoEnabled}>
          { videoOn && videoEnabled ? <Video /> : <VideoOff /> }
        </button>
        <button id='hang-up' className='button-primary control' onClick={handleHangUp}>
          <X />
        </button>
        <button className={audioClassNames} onClick={handleAudioToggle} disabled={!audioEnabled}>
          { audioOn && audioEnabled ? <Mic /> : <MicOff /> }
        </button>
      </div>
    )

  }

}
