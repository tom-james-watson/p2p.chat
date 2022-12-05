import React from "react";
import {
  MicrophoneIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import Button from "../lib/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { localActions, localState, LocalStreamKey } from "../../atoms/local";
import classNames from "classnames";
import assert from "assert";
import { useRouter } from "next/router";
import { getVideoAudioEnabled } from "../../lib/mesh/stream";
import { peersState } from "../../atoms/peers";
import { sendMessage } from "../../lib/mesh/data";
import { mapGet, rtcDataChannelMap, streamMap } from "../../lib/mesh/maps";

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

function TrackControl(track: "video" | "audio") {
  const [local, setLocal] = useRecoilState(localState);
  const peers = useRecoilValue(peersState);
  const stream = mapGet(streamMap, LocalStreamKey);

  assert(local.status === "connecting" || local.status === "connected");

  const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream);
  const enabled = track === "audio" ? audioEnabled : videoEnabled;

  const handleToggle = React.useCallback(() => {
    peers.forEach((peer) => {
      const channel = rtcDataChannelMap.get(peer.sid);

      if (channel !== undefined) {
        sendMessage(channel, {
          type: "peer-state",
          name: local.name,
          audioEnabled: track === "audio" ? !audioEnabled : audioEnabled,
          videoEnabled: track === "video" ? !videoEnabled : videoEnabled,
        });
      }
    });

    const tracks =
      track === "audio" ? stream?.getAudioTracks() : stream?.getVideoTracks();

    if (tracks !== undefined && tracks.length > 0) {
      tracks[0].enabled = !enabled;
    }

    setLocal(
      localActions.setAudioVideoEnabled(
        track === "audio" ? !audioEnabled : audioEnabled,
        track === "video" ? !videoEnabled : videoEnabled
      )
    );
  }, [audioEnabled, local.name, peers, setLocal, stream, videoEnabled]);

  const iconClassName = classNames("absolute", {
    "text-slate-800": !enabled,
  });

  return (
    <Control disabled={!enabled} text={track === "audio" ? "Mic" : "Cam"}>
      <Button
        color={enabled ? "slate" : "red"}
        icon={
          track === "audio" ? (
            <MicrophoneIcon width={24} className={iconClassName} />
          ) : (
            <VideoCameraIcon width={24} className={iconClassName} />
          )
        }
        onClick={handleToggle}
        square
      />
    </Control>
  );
}

function AudioControl() {
  return TrackControl("audio");
}

function VideoControl() {
  return TrackControl("video");
}

export default function Controls() {
  const router = useRouter();

  const handleLeave = React.useCallback(() => {
    router.push(
      `/goodbye?left=${router.query.roomCode}/${router.query.roomName}`,
      "/goodbye"
    );
  }, [router]);

  return (
    <div className="flex items-center justify-center m-2 sm:m-4 space-x-8">
      <AudioControl />
      <VideoControl />
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
