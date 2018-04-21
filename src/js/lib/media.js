import getMedia from 'getusermedia'

export default async function getVideoStream() {

  return new Promise((resolve, reject) => {

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
      resolve(media)
    })

  })

}
