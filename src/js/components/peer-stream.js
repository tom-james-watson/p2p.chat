import React from 'react'
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

  componentDidMount() {
    this.updateSrcObject()
  }

  componentDidUpdate() {
    if (!this.streamEle) {
      return
    }

    this.streamEle.onloadedmetadata = () => {
      if (this.state.videoWidth !== null || this.state.videoHeight !== null) {
        return
      }
      this.setState({
        videoWidth: this.streamEle.videoWidth,
        videoHeight: this.streamEle.videoHeight,
        videoReady: true
      })
    }

    this.updateSrcObject()
  }

  updateSrcObject() {
    const {peerStream} = this.props

    console.log({videoOn: peerStream.videoOn, audioOn: peerStream.audioOn, streamEle: this.streamEle, stream: peerStream.stream})

    if (
      this.streamEle &&
      peerStream.stream &&
      (peerStream.videoOn || peerStream.audioOn)
    ) {
      if ('srcObject' in this.streamEle) {
        this.streamEle.srcObject = peerStream.stream
      } else {
        // Older browsers don't support srcObject
        this.streamEle.src = URL.createObjectURL(peerStream.stream)
      }
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
            (peerStream.connected && !peerStream.videoOn) ? (
              <div className='peer-no-video' style={noVideoStyle}><User /></div>
            ) : null
          }
          {peerStream.videoOn ? (
            <video
              ref={ele => {this.streamEle = ele}}
              autoPlay
              style={videoStyle}
            />
          ) : null}
          {(!peerStream.videoOn && peerStream.audioOn) ? (
            <audio
              style={videoStyle}
              autoPlay
              ref={ele => {this.streamEle = ele}}
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
