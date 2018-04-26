import React from 'react'
import { Twitter } from 'react-feather';

export default (props) => {

  return (
    <div id='social'>
      <div>
        <a className='button' id='tweet' href='http://twitter.com/share?url=https://p2p.chat&text=p2p.chat' target='_blank'>
          <i />
          <span>Tweet</span>
        </a>
      </div>
      <div>
        <iframe
          src={`https://ghbtns.com/github-btn.html?user=tom-james-watson&repo=p2p.chat&type=star&count=true`}
          scrolling="0"
          width="80"
          height="20"
        />
      </div>
    </div>
  )

}
