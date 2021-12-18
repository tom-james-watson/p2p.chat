import React from "react";
import {
  MicrophoneIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import Button from "../lib/button";
import { useRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import classNames from "classnames";
import assert from "assert";

interface ControlProps {
  children: React.ReactElement;
  text: string;
}

function Control(props: ControlProps) {
  const { children, text } = props;

  return (
    <div className="flex flex-col items-center space-y-2">
      {children}
      <div className="text-sm">{text}</div>
    </div>
  );
}

export default function Controls() {
  const [local, setLocal] = useRecoilState(localState);

  assert(local.status === "connecting" || local.status === "connected");

  const stream = local.stream.stream;
  const videoTracks = stream?.getVideoTracks();
  const audioTracks = stream?.getAudioTracks();
  const videoEnabled =
    videoTracks !== undefined &&
    videoTracks.length > 0 &&
    videoTracks[0].enabled;
  const audioEnabled =
    audioTracks !== undefined &&
    audioTracks.length > 0 &&
    audioTracks[0].enabled;

  const handleToggleAudio = React.useCallback(() => {
    setLocal((local) => {
      assert(local.status === "connecting" || local.status === "connected");
      const stream = local.stream.stream;

      const audioTracks = stream?.getAudioTracks();

      if (audioTracks !== undefined && audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
      }

      return { ...local, stream: { ...local.stream, stream } };
    });
  }, [setLocal]);

  const handleToggleVideo = React.useCallback(() => {
    setLocal((local) => {
      assert(local.status === "connecting" || local.status === "connected");
      const stream = local.stream.stream;

      const videoTracks = stream?.getVideoTracks();

      if (videoTracks !== undefined && videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
      }

      return { ...local, stream: { ...local.stream, stream } };
    });
  }, [setLocal]);

  const videoIconClassName = classNames("absolute", {
    "text-slate-800": !videoEnabled,
  });
  const audioIconClassName = classNames("absolute", {
    "text-slate-800": !audioEnabled,
  });

  return (
    <div className="flex items-center justify-center m-2 sm:m-4 space-x-8">
      <Control text="Mic">
        <Button
          color="slate"
          icon={<MicrophoneIcon width={24} className={audioIconClassName} />}
          onClick={handleToggleAudio}
          square
        />
      </Control>
      <Control text="Cam">
        <Button
          color="slate"
          icon={<VideoCameraIcon width={24} className={videoIconClassName} />}
          onClick={handleToggleVideo}
          square
        />
      </Control>
      <Control text="Leave">
        <Button
          color="slate"
          icon={<PhoneIcon width={24} className="absolute text-red-500" />}
          square
        />
      </Control>
    </div>
  );
}
