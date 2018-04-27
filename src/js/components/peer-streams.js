import React from 'react'
import classNames from 'classnames'
import AwaitingPeers from './awaiting-peers'

export default (props) => {

  const {peerStreams, shrunk} = props

  let rows, columns

  const total = Object.keys(peerStreams).length

  const x = Math.sqrt(total)
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

  return (
    <div id="peer-streams" style={peerStreamsStyle} className={peerStreamsClassNames}>
      {total === 0 ? <AwaitingPeers /> : null}
      {
        Object.keys(peerStreams).map((id) => {
          return (
            <div key={id} className='peer-stream'>
              <video src={URL.createObjectURL(peerStreams[id])} autoPlay />
            </div>
          )
        })
      }
    </div>
  )

}
