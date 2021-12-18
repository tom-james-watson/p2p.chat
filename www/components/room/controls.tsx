import React from "react";
import {
  MicrophoneIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import Button from "../lib/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { localState } from "../../atoms/local";
import classNames from "classnames";
import assert from "assert";
import { useRouter } from "next/router";
import { getVideoAudioEnabled } from "../../lib/mesh/stream";
import { peersState } from "../../atoms/peers";
import { sendMessage } from "../../lib/mesh/data";

interface ControlProps {
  children: React.ReactElement;
  disabled?: boolean;
  text: string;
}

function Control(props: ControlProps) {
  const { children, disabled = false, text } = props;

  const textClassName = classNames("text-sm font-bold", {
    "text-red-500": disabled,
  });

  return (
    <div className="flex flex-col items-center space-y-2 relative">
      {children}
      <div className={textClassName}>{text}</div>
    </div>
  );
}

export default function Controls() {
  const router = useRouter();
  const [local, setLocal] = useRecoilState(localState);
  const peers = useRecoilValue(peersState);

  assert(local.status === "connecting" || local.status === "connected");

  const { audioEnabled, videoEnabled } = getVideoAudioEnabled(
    local.stream.stream
  );

  const handleLeave = React.useCallback(() => {
    router.push(
      `/goodbye?left=${router.query.roomCode}/${router.query.roomName}`,
      "/goodbye"
    );
  }, [router]);

  const handleToggleAudio = React.useCallback(() => {
    peers.forEach((peer) => {
      if (peer.channel !== undefined) {
        sendMessage(peer.channel, {
          type: "peer-state",
          name: local.name,
          audioEnabled: !audioEnabled,
          videoEnabled,
        });
      }
    });
    setLocal((local) => {
      assert(local.status === "connecting" || local.status === "connected");
      const stream = local.stream.stream;

      const audioTracks = stream?.getAudioTracks();

      if (audioTracks !== undefined && audioTracks.length > 0) {
        audioTracks[0].enabled = !audioEnabled;
      }

      return { ...local, stream: { ...local.stream, stream } };
    });
  }, [audioEnabled, local.name, peers, setLocal, videoEnabled]);

  const handleToggleVideo = React.useCallback(() => {
    peers.forEach((peer) => {
      if (peer.channel !== undefined) {
        sendMessage(peer.channel, {
          type: "peer-state",
          name: local.name,
          audioEnabled,
          videoEnabled: !videoEnabled,
        });
      }
    });
    setLocal((local) => {
      assert(local.status === "connecting" || local.status === "connected");
      const stream = local.stream.stream;

      const videoTracks = stream?.getVideoTracks();

      if (videoTracks !== undefined && videoTracks.length > 0) {
        videoTracks[0].enabled = !videoEnabled;
      }

      return { ...local, stream: { ...local.stream, stream } };
    });
  }, [audioEnabled, local.name, peers, setLocal, videoEnabled]);

  const videoIconClassName = classNames("absolute", {
    "text-slate-800": !videoEnabled,
  });
  const audioIconClassName = classNames("absolute", {
    "text-slate-800": !audioEnabled,
  });

  return (
    <div className="flex items-center justify-center m-2 sm:m-4 space-x-8">
      <Control disabled={!audioEnabled} text="Mic">
        <Button
          color={audioEnabled ? "slate" : "red"}
          icon={<MicrophoneIcon width={24} className={audioIconClassName} />}
          onClick={handleToggleAudio}
          square
        />
      </Control>
      <Control disabled={!videoEnabled} text="Cam">
        <Button
          color={videoEnabled ? "slate" : "red"}
          icon={<VideoCameraIcon width={24} className={videoIconClassName} />}
          onClick={handleToggleVideo}
          square
        />
      </Control>
      <Control text="Leave">
        <Button
          color="slate"
          icon={<PhoneIcon width={24} className="absolute text-red-500" />}
          onClick={handleLeave}
          square
        />
      </Control>
    </div>
  );
}
