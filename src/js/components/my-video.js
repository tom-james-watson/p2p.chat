import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'

export default class MyVideo extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {

    return shallowCompare(this, nextProps, nextState);

  }

  render() {

    const {stream} = this.props

    return (
      <video id='my-video' src={URL.createObjectURL(stream)} autoPlay muted />
    )

  }

}
