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

export const stopStream = (stream: MediaStream | null) => {
  if (stream === null) {
    return;
  }

  stream.getTracks().forEach((track) => {
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
} = {}): Promise<MediaStream | null> => {
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
    return await getMediaStream({ video, audio });
  } catch (err) {
    console.error(err);
    try {
      // Try just audio
      return await getMediaStream({ audio });
    } catch (err) {
      console.error(err);
      try {
        // Try just video
        return await getMediaStream({ video });
      } catch (err) {
        console.error(err);
        // No stream
        return null;
      }
    }
  }
};

export const getVideoAudioEnabled = (
  stream: MediaStream | null
): { audioEnabled: boolean; videoEnabled: boolean } => {
  if (stream === null) {
    return { audioEnabled: false, videoEnabled: false };
  }

  const videoTracks = stream.getVideoTracks();
  const audioTracks = stream.getAudioTracks();

  const videoEnabled =
    videoTracks !== undefined &&
    videoTracks.length > 0 &&
    videoTracks[0].enabled;
  const audioEnabled =
    audioTracks !== undefined &&
    audioTracks.length > 0 &&
    audioTracks[0].enabled;

  return { audioEnabled, videoEnabled };
};
