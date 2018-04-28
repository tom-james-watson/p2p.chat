import React from 'react'
import classNames from 'classnames'
import {User} from 'react-feather';
import AwaitingPeers from './awaiting-peers'

export default class Home extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      height: 0
    }
  }

  componentDidMount() {
    this.recalculateGrid()
  }

  componentDidUpdate() {
    this.recalculateGrid()
  }

  recalculateGrid() {

    const {width, height} = this.state

    const newWidth = this.peerStreams.clientWidth
    const newHeight = this.peerStreams.clientHeight

    if (newWidth !== width || newHeight !== height) {
      this.setState({width: newWidth, height: newHeight})
    }

  }

  render() {

    const {peerStreams, shrunk} = this.props
    const {width, height} = this.state

    let rows, columns

    const total = Object.keys(peerStreams).length

    const x = Math.floor(Math.sqrt(total))
    const y = Math.ceil(total / x)

    // Switch rows/columns for tall screens (probably mobile)
    if (window.innerWidth < window.innerHeight) {
      columns = x
      rows = y
    } else {
      rows = x
      columns = y
    }

    const peerStreamsClassNames = classNames({shrunk})
    const peerStreamsStyle = {
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }

    const maxVideoWidth = `calc(${width / columns}px - 4rem)`
    const maxVideoHeight = `calc(${height / rows}px - 4rem)`

    console.log({width, height, maxVideoWidth, maxVideoHeight, rows, columns})

    return (
      <div
        id="peer-streams"
        ref={ (peerStreams) => this.peerStreams = peerStreams}
        style={peerStreamsStyle}
        className={peerStreamsClassNames}
      >
        {total === 0 ? <AwaitingPeers /> : null}
        {
          Object.keys(peerStreams).map((id) => {
            if (!peerStreams[id].stream) {
              return null
            }
            return (
              <div key={id} className='peer-stream'>
                <div className='stream-wrapper'>
                  <button className='nickname' disabled>{peerStreams[id].nickname}</button>
                  <video
                    src={URL.createObjectURL(peerStreams[id].stream)}
                    style={{maxWidth: maxVideoWidth, maxHeight: maxVideoHeight}}
                    autoPlay
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    )

  }

}
