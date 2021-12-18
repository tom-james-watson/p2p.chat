import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/outline";
import React from "react";
import { useSetRecoilState } from "recoil";
import { localActions, localState, LocalStreamKey } from "../../atoms/local";
import { mapGet, streamMap } from "../../lib/mesh/maps";
import {
  createLocalStream,
  Devices,
  getDevices,
  getVideoAudioEnabled,
  stopStream,
} from "../../lib/mesh/stream";
import Select from "../lib/select";
import LocalPreview from "./local-preview";
import PreForm from "./pre-form";

export default function RequestDevices() {
  const setLocal = useSetRecoilState(localState);
  const [devices, setDevices] = React.useState<Devices>();

  React.useEffect(() => {
    (async () => {
      setDevices(await getDevices());
    })();
  }, []);

  const joinRoom = React.useCallback(async () => {
    const stream = mapGet(streamMap, LocalStreamKey);
    const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream);
    setLocal(localActions.setConnecting(audioEnabled, videoEnabled));
  }, [setLocal]);

  const handleDeviceChange = React.useCallback(
    async (
      deviceId: string | undefined,
      cb: (devices: Devices) => Promise<MediaStream | null>
    ) => {
      if (devices === undefined || deviceId === undefined) {
        return;
      }

      const stream = mapGet(streamMap, LocalStreamKey);
      stopStream(stream);
      streamMap.set(LocalStreamKey, await cb(devices));
    },
    [devices]
  );

  const handleAudioChange = React.useCallback(
    (deviceId: string | undefined) => {
      handleDeviceChange(deviceId, async (devices: Devices) => {
        const selectedAudio =
          devices.audio.find((device) => {
            return device.id === deviceId;
          }) ?? null;
        const stream = await createLocalStream({
          audioDeviceId: selectedAudio?.id,
          videoDeviceId: devices.selectedVideo?.id,
        });
        setDevices({ ...devices, selectedAudio });
        return stream;
      });
    },
    [handleDeviceChange]
  );

  const handleVideoChange = React.useCallback(
    (deviceId: string | undefined) => {
      handleDeviceChange(deviceId, async (devices: Devices) => {
        const selectedVideo =
          devices.video.find((device) => {
            return device.id === deviceId;
          }) ?? null;
        const stream = await createLocalStream({
          videoDeviceId: selectedVideo?.id,
          audioDeviceId: devices.selectedAudio?.id,
        });
        setDevices({ ...devices, selectedVideo });
        return stream;
      });
    },
    [handleDeviceChange]
  );

  return (
    <PreForm
      body={
        <>
          <LocalPreview />
          <Select
            id="audio-select"
            fallback="No microphones found"
            icon={<MicrophoneIcon width={20} />}
            label="Microphone"
            selectedOption={
              devices?.selectedAudio
                ? {
                    value: devices.selectedAudio.id,
                    text: devices.selectedAudio.name,
                  }
                : undefined
            }
            options={
              devices?.audio.map((device) => {
                return {
                  value: device.id,
                  text: device.name,
                };
              }) ?? []
            }
            setValue={handleAudioChange}
          />
          <Select
            id="video-select"
            fallback="No cameras found"
            icon={<VideoCameraIcon width={20} />}
            label="Camera"
            selectedOption={
              devices?.selectedVideo
                ? {
                    value: devices.selectedVideo.id,
                    text: devices.selectedVideo.name,
                  }
                : undefined
            }
            options={
              devices?.video.map((device) => {
                return {
                  value: device.id,
                  text: device.name,
                };
              }) ?? []
            }
            setValue={handleVideoChange}
          />
        </>
      }
      handleSubmit={joinRoom}
      submitText="Join room"
    />
  );
}
