export interface Stream {
  stream: MediaStream | null;
  audio: {
    granted: boolean;
  };
  video: {
    granted: boolean;
  };
}

export interface Device {
  id: string;
  name: string;
}

export interface Devices {
  audio: Device[];
  selectedAudio: Device | null;
  video: Device[];
  selectedVideo: Device | null;
}

export const stopStream = (stream: Stream) => {
  stream.stream?.getTracks().forEach((track) => {
    track.stop();
  });
};

const getMediaStream = async (
  constraints: MediaStreamConstraints
): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia(constraints);
};

export const getDevices = async (): Promise<Devices> => {
  const devices: Devices = {
    audio: [],
    selectedAudio: null,
    video: [],
    selectedVideo: null,
  };

  (await navigator.mediaDevices.enumerateDevices()).forEach((mediaDevice) => {
    // We can't see what the device is. This happens when you enumerate devices
    // without permission having being granted to access that type of device.
    if (mediaDevice.label === "") {
      return;
    }

    const device: Device = {
      id: mediaDevice.deviceId,
      name: mediaDevice.label,
    };

    if (mediaDevice.kind.toLowerCase().includes("audio")) {
      devices.audio.push(device);

      if (devices.selectedAudio === null) {
        devices.selectedAudio = device;
      }
    }

    if (mediaDevice.kind.toLowerCase().includes("video")) {
      devices.video.push(device);

      if (devices.selectedVideo === null) {
        devices.selectedVideo = device;
      }
    }
  });

  return devices;
};

export const createLocalStream = async ({
  audioDeviceId,
  videoDeviceId,
}: {
  audioDeviceId?: string;
  videoDeviceId?: string;
} = {}): Promise<Stream> => {
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

  const audio =
    audioDeviceId !== undefined ? { deviceId: audioDeviceId } : true;
  const video =
    videoDeviceId !== undefined ? { deviceId: videoDeviceId } : true;

  try {
    // Try and get video and audio
    const stream = await getMediaStream({ video, audio });
    return { stream, audio: { granted: true }, video: { granted: true } };
  } catch (err) {
    console.error(err);
    try {
      // Try just audio
      const stream = await getMediaStream({ audio });
      return { stream, audio: { granted: true }, video: { granted: false } };
    } catch (err) {
      console.error(err);
      try {
        // Try just video
        const stream = await getMediaStream({ video });
        return { stream, audio: { granted: false }, video: { granted: true } };
      } catch (err) {
        console.error(err);
        // No stream
        return {
          stream: null,
          audio: { granted: false },
          video: { granted: false },
        };
      }
    }
  }
};
