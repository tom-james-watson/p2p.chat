import getMedia from 'getusermedia'

async function getMediaStream(opts) {
  return new Promise(async (resolve, reject) => {
    getMedia(opts, function (err, stream) {
      if (err) {
        return reject(err)
      }

      resolve(stream)
    })
  })
}

export default async function getMyStream() {

  const video = {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480,
      maxAspectRatio: 4/3,
      maxFrameRate: 24,
    }
  }
  const audio = {
    autoGainControl: false,
    sampleRate: {ideal: 48000, min: 35000},
    echoCancellation: false,
    channelCount: {ideal: 1},
    volume: 1
  }

  try {
    // Try and get video and audio
    const stream = await getMediaStream({video, audio})
    return {myStream: stream, audioEnabled: true, videoEnabled: true}
  } catch (e) {
    try {
      // If that fails, try just audio
      const stream = await getMediaStream({audio})
      return {myStream: stream, audioEnabled: true, videoEnabled: false}
    } catch (err) {
      try {
        // If that fails, try just video
        const stream = await getMediaStream({video})
        return {myStream: stream, audioEnabled: false, videoEnabled: true}
      } catch (e) {
        return {myStream: null, audioEnabled: false, videoEnabled: false}
      }
    }
  }
}
