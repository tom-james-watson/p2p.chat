import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/outline";
import React from "react";
import { useRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import { createLocalStream, Devices, getDevices } from "../../lib/mesh/stream";
import Select from "../lib/select";
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
    setLocal((local) => {
      if (local.status !== "requestingDevices") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      return { ...local, status: "connecting" };
    });
  }, [setLocal]);

  const handleAudioChange = React.useCallback(
    async (deviceId: string | undefined) => {
      if (devices === undefined || deviceId === undefined) {
        return;
      }

      if (local.status !== "requestingDevices") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      local.stream.stream?.getTracks().forEach((track) => {
        track.stop();
      });

      const selectedAudio =
        devices.audio.find((device) => {
          return device.id === deviceId;
        }) ?? null;

      const stream = await createLocalStream({
        audioDeviceId: selectedAudio?.id,
        videoDeviceId: devices.selectedVideo?.id,
      });

      setDevices({ ...devices, selectedAudio });
      setLocal((local) => {
        if (local.status !== "requestingDevices") {
          throw new Error(
            "Trying to set connecting whilst in unexpected status"
          );
        }

        return { ...local, stream };
      });
    },
    [devices, local, setLocal]
  );

  const handleVideoChange = React.useCallback(
    async (deviceId: string | undefined) => {
      if (devices === undefined || deviceId === undefined) {
        return;
      }

      if (local.status !== "requestingDevices") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      local.stream.stream?.getTracks().forEach((track) => {
        track.stop();
      });

      const selectedVideo =
        devices.video.find((device) => {
          return device.id === deviceId;
        }) ?? null;

      const stream = await createLocalStream({
        audioDeviceId: devices.selectedAudio?.id,
        videoDeviceId: selectedVideo?.id,
      });

      setDevices({ ...devices, selectedVideo });
      setLocal((local) => {
        if (local.status !== "requestingDevices") {
          throw new Error(
            "Trying to set connecting whilst in unexpected status"
          );
        }

        return { ...local, stream };
      });
    },
    [devices, local, setLocal]
  );

  return (
    <PreForm
      body={
        <>
          <div className="w-full h-48 bg-slate-900 rounded-md">
            {local.status === "requestingDevices" && (
              <video
                ref={(video) => {
                  if (video === null) {
                    return;
                  }
                  video.srcObject = local.stream.stream;
                }}
                autoPlay
                muted
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
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
