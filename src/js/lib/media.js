import getMedia from 'getusermedia'

export default async function getMyStream() {

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
      // TODO - handle failing video / audio
      resolve({myStream: media, audioOn: true, videoOn: true})
    })

  })

}
