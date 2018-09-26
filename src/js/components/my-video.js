import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {User} from 'react-feather'

export default class MyVideo extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {

    return shallowCompare(this, nextProps, nextState);

  }

  render() {

    const {stream, videoOn, videoEnabled} = this.props

    let streamURL

    if (videoEnabled && videoOn) {
      try {
        streamURL = URL.createObjectURL(stream)
      } catch(err) {
        console.error(err)
      }
    }

    if (streamURL) {
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
