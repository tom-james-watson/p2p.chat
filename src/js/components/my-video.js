import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {User} from 'react-feather'

export default class MyVideo extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidMount() {
    this.updateSrcObject()
  }

  componentDidUpdate() {
    this.updateSrcObject()
  }

  updateSrcObject() {
    const {stream, videoOn, videoEnabled} = this.props

    console.log({videoOn, videoEnabled})

    if (this.streamEle && videoOn && videoEnabled) {
      if ('srcObject' in this.streamEle) {
        this.streamEle.srcObject = stream
      } else {
        // Older browsers don't support srcObject
        this.streamEle.src = URL.createObjectURL(stream)
      }
    }
  }

  render() {

    const {stream, videoOn, videoEnabled} = this.props

    if (videoEnabled && videoOn) {
      return (
        <video ref={ele => {this.streamEle = ele}} id='my-video' autoPlay muted />
      )
    } else {
      return (
        <User className='no-video' />
      )
    }

  }

}
