export interface Stream {
  stream: MediaStream | null;
  audio: {
    enabled: boolean;
  };
  video: {
    enabled: boolean;
  };
}

const getMediaStream = async (
  constraints: MediaStreamConstraints
): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia(constraints);
};

export const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  return await navigator.mediaDevices.enumerateDevices();
};

export const createLocalStream = async (): Promise<Stream> => {
  // const video = {
  //   facingMode: "user",
  //   // width: { min: 640, ideal: 1280, max: 1920 },
  //   // height: { min: 360, ideal: 720, max: 1080 },
  //   // frameRate: { ideal: 15, max: 24 },
  // };
  // const audio = {
  //   autoGainControl: true,
  //   sampleRate: { ideal: 48000, min: 35000 },
  //   echoCancellation: true,
  //   channelCount: { ideal: 1 },
  // };

  try {
    // Try and get video and audio
    const stream = await getMediaStream({ video: true, audio: true });
    return { stream, audio: { enabled: true }, video: { enabled: true } };
  } catch (err) {
    console.error(err);
    try {
      // Try just audio
      const stream = await getMediaStream({ audio: true });
      return { stream, audio: { enabled: true }, video: { enabled: false } };
    } catch (err) {
      console.error(err);
      try {
        // Try just video
        const stream = await getMediaStream({ video: true });
        return { stream, audio: { enabled: false }, video: { enabled: true } };
      } catch (err) {
        console.error(err);
        // No stream
        return {
          stream: null,
          audio: { enabled: false },
          video: { enabled: false },
        };
      }
    }
  }
};
