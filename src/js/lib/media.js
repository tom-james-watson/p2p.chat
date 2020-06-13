async function getMediaStream(opts) {
  return navigator.mediaDevices.getUserMedia(opts)
}

export default async function getMyStream() {

  const video = {
    facingMode: "user",
    width: {min: 640, ideal: 1280, max: 1920},
    height: {min: 360, ideal: 720, max: 1080},
    frameRate: {ideal: 15, max: 24},
  }
  const audio = {
    autoGainControl: true,
    sampleRate: {ideal: 48000, min: 35000},
    echoCancellation: true,
    channelCount: {ideal: 1},
  }

  try {
    // Try and get video and audio
    console.log('try video and audio')
    const stream = await getMediaStream({video, audio})
    return {myStream: stream, audioEnabled: true, videoEnabled: true}
  } catch (err) {
    console.error(err)
    try {
      console.log('try just audio')
      // If that fails, try just audio
      const stream = await getMediaStream({audio})
      return {myStream: stream, audioEnabled: true, videoEnabled: false}
    } catch (err) {
      console.error(err)
      try {
        console.log('try just video')
        // If that fails, try just video
        const stream = await getMediaStream({video})
        return {myStream: stream, audioEnabled: false, videoEnabled: true}
      } catch (e) {
        return {myStream: null, audioEnabled: false, videoEnabled: false}
      }
    }
  }
}
