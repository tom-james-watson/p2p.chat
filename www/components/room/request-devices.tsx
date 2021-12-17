import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/outline";
import assert from "assert";
import React from "react";
import { useRecoilState } from "recoil";
import { localActions, localState } from "../../atoms/local";
import {
  createLocalStream,
  Devices,
  getDevices,
  stopStream,
  Stream,
} from "../../lib/mesh/stream";
import Select from "../lib/select";
import LocalPreview from "./local-preview";
import PreForm from "./pre-form";

export default function RequestDevices() {
  const [local, setLocal] = useRecoilState(localState);
  const [devices, setDevices] = React.useState<Devices>();

  React.useEffect(() => {
    (async () => {
      setDevices(await getDevices());
    })();
  }, []);

  const joinRoom = React.useCallback(async () => {
    setLocal(localActions.setConnecting);
  }, [setLocal]);

  const handleDeviceChange = React.useCallback(
    async (
      deviceId: string | undefined,
      cb: (devices: Devices) => Promise<Stream>
    ) => {
      if (devices === undefined || deviceId === undefined) {
        return;
      }

      assert(local.status === "requestingDevices");
      stopStream(local.stream);
      setLocal(localActions.updateStream(await cb(devices)));
    },
    [devices, local, setLocal]
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
