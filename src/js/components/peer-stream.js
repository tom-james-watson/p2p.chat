import React from 'react'
import classNames from 'classnames'
import AwaitingPeers from './awaiting-peers'
import {Loader} from 'react-feather';

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
          {
            !peerStream.stream || videoReady ? (
              <button className='nickname' disabled>{peerStream.nickname}</button>
            ) : null
          }
          {
            peerStream.stream ? (
              <video
                ref={(video) => {this.video = video}}
                src={URL.createObjectURL(peerStream.stream)}
                style={videoStyle}
                autoPlay
              />
            ) : (
              <div className='video-placeholder' style={placeHolderStyle}>
                <Loader size={32} className='spinner' />
              </div>
            )
          }
        </div>
      </div>
    )

  }

}
