import assert from "assert";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import { Local } from "../../atoms/local";
import { peersActions, SetPeers } from "../../atoms/peers";
import { registerDataChannel } from "./data";

const iceServers = {
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const createRtcPeerConnection = (
  socket: Socket<ServerEvents, ClientEvents>,
  local: Local,
  sid: string,
  setPeers: SetPeers,
  creator: boolean
): RTCPeerConnection => {
  assert(local.status === "connecting");

  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  local.stream.stream?.getTracks().forEach((track) => {
    if (local.stream.stream !== null) {
      rtcPeerConnection.addTrack(track, local.stream.stream);
    }
  });

  rtcPeerConnection.ontrack = (e) => {
    if (e.streams.length > 0) {
      console.debug(`peer stream received ${sid}`);
      setInterval(() => {
        console.log({ original: e.streams[0] });
      }, 3000);
      setPeers(peersActions.addPeerTrack(sid, e.streams[0]));
    }
  };

  rtcPeerConnection.onicecandidate = (e) => {
    if (e.candidate !== null) {
      socket.emit("webRtcIceCandidate", {
        sid,
        label: e.candidate.sdpMLineIndex,
        candidate: e.candidate.candidate,
      });
    }

    if (
      rtcPeerConnection.iceConnectionState === "connected" ||
      rtcPeerConnection.iceConnectionState === "completed"
    ) {
      console.debug(`peer fully connected ${sid}`);
      setPeers(peersActions.setPeerConnected(sid));
    }
  };

  if (creator) {
    const channel = rtcPeerConnection.createDataChannel("data");
    registerDataChannel(sid, channel, local, setPeers);
  } else {
    rtcPeerConnection.ondatachannel = (event) => {
      registerDataChannel(sid, event.channel, local, setPeers);
    };
  }

  return rtcPeerConnection;
};
