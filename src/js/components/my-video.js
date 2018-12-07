import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {User} from 'react-feather'

export default class MyVideo extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    this.updateSrcObject()
  }

  componentDidUpdate() {
    this.updateSrcObject()
  }

  updateSrcObject() {
    const {stream, videoOn, videoEnabled} = this.props

    if (this.streamEle && videoOn && videoEnabled) {
      this.streamEle.srcObject = this.props.stream
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
