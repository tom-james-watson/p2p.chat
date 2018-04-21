import React from 'react'

var getMedia = require('getusermedia')
var recorder = require('media-recorder-stream')
var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')

export default class Home extends React.Component {
  render() {
    return <h1>Hello, World</h1>
  }
}

const opts = {
  video: {
    mandatory: {
      maxWidth: 320,
      maxHeight: 240,
      maxAspectRatio:4/3,
      maxFrameRate:10
    }
  },
  audio: true
}

getMedia(opts, function (err, media) {
  if (err) throw err

  const video = document.createElement('video')
  video.src = URL.createObjectURL(media)
  video.autoplay = true
  document.body.appendChild(video)

  var hub = signalhub('swarm-example', ['https://tomjwatson-signalhub.herokuapp.com'])
  var sw = swarm(hub)

  sw.on('peer', function (peer, id) {
    console.log('connected to a new peer:', {id, peer})
    console.log('total peers:', sw.peers.length)
    peer.on('stream', function(stream) {
      console.log('received stream', stream)
      var video = document.createElement('video')
      video.src = window.URL.createObjectURL(stream)
      document.body.appendChild(video)
      video.play()
    })
    peer.on('data', function(data) {
      console.log('received data', JSON.parse(data.toString()))
      console.log('adding stream')
      peer.addStream(media)
    })
    peer.send(JSON.stringify({test: 'hi'}))
  })

  sw.on('disconnect', function (peer, id) {
    console.log('disconnected from a peer:', id)
    console.log('total peers:', sw.peers.length)
  })

})
