import React from 'react'

export default (props) => {

  const {peerStreams} = props

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

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`
  }

  return (
    <div id="peer-streams" style={gridStyle}>
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
