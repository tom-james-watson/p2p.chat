import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import {User} from 'react-feather';
import AwaitingPeers from './awaiting-peers'
import InitializingSwarm from './initializing-swarm'
import PeerStream from './peer-stream'

export default class PeerStreams extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      height: 0,
    }
  }

  componentDidMount() {
    this.recalculateGrid()
  }

  componentDidUpdate() {
    this.recalculateGrid()
  }

  shouldComponentUpdate(nextProps, nextState) {

    const {width, height} = this.state
    const {newWidth, newHeight} = this.calculateNewDimensions()

    const dimensionsChanged = width !== newWidth || height !== newHeight

    return dimensionsChanged || shallowCompare(this, nextProps, nextState);

  }

  calculateNewDimensions() {

    const {width, height} = this.state

    const newWidth = this.peerStreams.clientWidth
    const newHeight = this.peerStreams.clientHeight

    return {newWidth, newHeight}

  }

  recalculateGrid() {

    const {width, height} = this.state

    const {newWidth, newHeight} = this.calculateNewDimensions()

    if (newWidth !== width || newHeight !== height) {
      this.setState({width: newWidth, height: newHeight})
    }

  }

  render() {

    const {peerStreams, shrunk, swarmInitialized} = this.props
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

    const cellWidth = width / columns
    const cellHeight = height / rows

    return (
      <div
        id="peer-streams"
        ref={(peerStreams) => {this.peerStreams = peerStreams}}
        style={peerStreamsStyle}
        className={peerStreamsClassNames}
      >
        {!swarmInitialized ? <InitializingSwarm /> : null}
        {swarmInitialized && total === 0 ? <AwaitingPeers /> : null}
        {
          swarmInitialized && Object.keys(peerStreams).map((id) => {
            return (
              <PeerStream
                key={id}
                peerStream={peerStreams[id]}
                cellWidth={cellWidth}
                cellHeight={cellHeight}
              />
            )
          })
        }
      </div>
    )

  }

}
