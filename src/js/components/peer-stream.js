import React from 'react'
import classNames from 'classnames'
import AwaitingPeers from './awaiting-peers'
import {MicOff, User} from 'react-feather'
import LoadingIndicator from './loading-indicator'

export default class PeerStream extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      videoWidth: null,
      videoHeight: null
    }

  }

  componentDidUpdate() {

    if (!this.video) {
      return
    }

    this.video.onloadedmetadata = () => {
      if (this.state.videoWidth !== null || this.state.videoHeight !== null) {
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

    const cellAspectRatio = cellWidth / cellHeight

    const videoAspectRatio = videoWidth / videoHeight

    // Make placeholder a 4:3 black box
    let placeHolderWidth, placeHolderHeight

    if (cellAspectRatio > 4 / 3) {
      placeHolderHeight = cellHeight
      placeHolderWidth = cellHeight * 4 / 3
    } else {
      placeHolderWidth = cellWidth
      placeHolderHeight = cellWidth / 4 * 3
    }

    const placeHolderStyle = {
      width: `calc(${placeHolderWidth}px - 2rem)`,
      height: `calc(${placeHolderHeight}px - 2rem)`,
    }

    const noVideoStyle = {
      width: `calc(${placeHolderWidth}px - 2rem)`,
      height: `calc(${placeHolderHeight}px - 2rem)`,
    }

    const videoStyle = {
      maxWidth: `calc(${cellWidth}px - 2rem)`,
      maxHeight: `calc(${cellHeight}px - 2rem)`
    }

    if (videoReady) {
      if (videoAspectRatio < cellAspectRatio) {
        videoStyle.height = `calc(${cellHeight}px - 2rem)`
      } else {
        videoStyle.width = `calc(${cellWidth}px - 2rem)`
      }
    } else {
      videoStyle.display = 'none'
    }

    let peerStreamURL

    if (peerStream.stream && (peerStream.videoOn || peerStream.audioOn)) {
      try {
        peerStreamURL = URL.createObjectURL(peerStream.stream)
      } catch (err) {
        console.error(err)
      }
    }

    return (
      <div className='peer-stream'>
        <div className='stream-wrapper'>
          <div className='stream-status'>
            <button className='nickname' disabled>{peerStream.nickname}</button>
            {
              (peerStream.connected && !peerStream.audioOn) ? (
                <MicOff size={18} />
              ) : null
            }
          </div>
          {
            (peerStream.connected && (!peerStreamURL || !peerStream.videoOn)) ? (
              <div className='peer-no-video' style={noVideoStyle}><User /></div>
            ) : null
          }
          {peerStreamURL && (peerStream.videoOn) ? (
            <video
              ref={(video) => {this.video = video}}
              src={}
              style={videoStyle}
              autoPlay
            />
          ) : null}
          {peerStreamURL && (!peerStream.videoOn && peerStream.audioOn) ? (
            <audio
              src={URL.createObjectURL(peerStreamURL)}
              style={videoStyle}
              autoPlay
            />
          ) : null}
          {
            !peerStream.connected ? (
              <div className='video-placeholder' style={placeHolderStyle}>
                <LoadingIndicator />
              </div>
            ) : null
          }
        </div>
      </div>
    )

  }

}
