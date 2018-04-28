import getMedia from 'getusermedia'

export default async function getVideoStream() {

  return new Promise(async (resolve, reject) => {

    const opts = {
      video: {
        mandatory: {
          maxWidth: 640,
          maxHeight: 480,
          maxAspectRatio: 4/3,
          maxFrameRate: 24,
        },
      },
      audio: true
    }

    getMedia(opts, function (err, media) {
      if (err) throw err
      resolve(media)
    })

  })

}
