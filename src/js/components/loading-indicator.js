import React from 'react'

export default (props) => {

  const {children} = props

  return (
    <div className='loading-indicator'>
      <div className='loading-inner' />
      {
        children ? (
          <div className='loading-text'>
            {children}
          </div>
        ) : null
      }
    </div>
  )

}
