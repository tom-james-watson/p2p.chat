import getMedia from 'getusermedia'

export default async function getVideoStream() {

  return new Promise(async (resolve, reject) => {

    const opts = {
      video: {
        mandatory: {
          maxWidth: 800,
          maxHeight: 600,
          maxAspectRatio: 4/3,
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
