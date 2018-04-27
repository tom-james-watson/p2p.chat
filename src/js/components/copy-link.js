import React from 'react'
import copy from 'copy-to-clipboard'

export default class CopyLink extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      copied: false,
    }

  }

  handleCopy() {

    copy(window.location.href);

    this.setState({
      copied: true
    });

    setTimeout(function() {
      this.setState({
        copied: false
      });
    }.bind(this), 2000);

  }

  render() {

    const {copied} = this.state

    return (
      <button
        className='invite button-primary'
        type='button'
        onClick={this.handleCopy.bind(this)}
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    )

  }

}
