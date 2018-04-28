import React from 'react'
import classNames from 'classnames'
import AwaitingPeers from './awaiting-peers'

export default class PeerStream extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      videoWidth: 0,
      videoHeight: 0
    }

  }

  componentDidUpdate() {

    if (!this.video) {
      return
    }

    this.video.onloadedmetadata = () => {
      if (this.state.videoWidth || this.state.videoHeight) {
        return
      }
      this.setState({
        videoWidth: this.video.videoWidth,
        videoHeight: this.video.videoHeight,
        videoReady: true
      })
    }

  }

  render() {

    const {peerStream, cellWidth, cellHeight} = this.props
    const {videoReady, videoWidth, videoHeight} = this.state

    if (!peerStream.stream) {
      return null
    }

    const style = {
      maxWidth: `calc(${cellWidth}px - 2rem)`,
      maxHeight: `calc(${cellHeight}px - 2rem)`
    }

    const cellAspectRatio = cellWidth / cellHeight

    const videoAspectRatio = videoWidth / videoHeight

    if (videoReady) {
      if (videoAspectRatio < cellAspectRatio) {
        style.height = `calc(${cellHeight}px - 2rem)`
      } else {
        style.width = `calc(${cellWidth}px - 2rem)`
      }
    } else {
      style.display = 'none'
    }

    return (
      <div className='peer-stream'>
        <div className='stream-wrapper'>
          {
            videoReady ? (
              <button className='nickname' disabled>{peerStream.nickname}</button>
            ) : null
          }
          <video
            key="thghfgjhgfh"
            ref={(video) => {this.video = video}}
            src={URL.createObjectURL(peerStream.stream)}
            style={style}
            autoPlay
          />
        </div>
      </div>
    )

  }

}
