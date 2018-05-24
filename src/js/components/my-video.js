import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {User} from 'react-feather'

export default class MyVideo extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {

    return shallowCompare(this, nextProps, nextState);

  }

  render() {

    const {stream, videoOn, videoEnabled} = this.props

    if (videoEnabled && videoOn) {
      return (
        <video id='my-video' src={URL.createObjectURL(stream)} autoPlay muted />
      )
    } else {
      return (
        <User className='no-video' />
      )
    }

  }

}
