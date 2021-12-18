import assert from "assert";
import { Local, LocalStreamKey } from "../../atoms/local";
import { peersActions, SetPeers } from "../../atoms/peers";
import { mapGet, rtcDataChannelMap, streamMap } from "./maps";
import { getVideoAudioEnabled } from "./stream";

interface MessagePeerState {
  type: "peer-state";
  name: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export type Message = MessagePeerState;

const onPeerState = (
  sid: string,
  message: MessagePeerState,
  setPeers: SetPeers
) => {
  console.debug(
    `received peer state sid=[${sid}] name=[${message.name}] audioEnabled=[${message.audioEnabled}] videoEnabled=[${message.videoEnabled}]`
  );
  setPeers(
    peersActions.setPeerState(
      sid,
      message.name,
      message.audioEnabled,
      message.videoEnabled
    )
  );
};

export const sendMessage = (channel: RTCDataChannel, message: Message) => {
  channel.send(JSON.stringify(message));
};

export const registerDataChannel = (
  sid: string,
  channel: RTCDataChannel,
  local: Local,
  setPeers: SetPeers
): void => {
  assert(
    local.status !== "requestingName" &&
      local.status !== "requestingPermissions"
  );

  channel.onopen = () => {
    const stream = mapGet(streamMap, LocalStreamKey);
    const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream);
    sendMessage(channel, {
      type: "peer-state",
      name: local.name,
      audioEnabled,
      videoEnabled,
    });
  };

  channel.onmessage = function (event) {
    const message: Message = JSON.parse(event.data);

    switch (message.type) {
      case "peer-state": {
        onPeerState(sid, message, setPeers);
      }
    }
  };

  rtcDataChannelMap.set(sid, channel);
};
