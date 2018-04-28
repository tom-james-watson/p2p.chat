import React from 'react'
import classNames from 'classnames'
import {Mic, MicOff, Video, VideoOff} from 'react-feather';

export default class Chat extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      stream: props.stream,
      audioOn: true,
      videoOn: true,
    }

  }

  handleVideoToggle() {

    const {stream, videoOn} = this.state

    stream.getVideoTracks()[0].enabled = !videoOn

    this.setState({
      videoOn: !videoOn
    })

  }

  handleAudioToggle() {

    const {stream, audioOn} = this.state

    stream.getAudioTracks()[0].enabled = !audioOn

    this.setState({
      audioOn: !audioOn
    })

  }

  render() {

    const {stream, audioOn, videoOn} = this.state

    const {expanded} = this.props

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
          <button className={videoClassNames} onClick={this.handleVideoToggle.bind(this)}>
            { videoOn ? <Video /> : <VideoOff /> }
          </button>
          <button className={audioClassNames} onClick={this.handleAudioToggle.bind(this)}>
            { audioOn ? <Mic /> : <MicOff /> }
          </button>
        </div>
      </div>
    )

  }

}
