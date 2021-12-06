import { SetterOrUpdater } from "recoil";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../lib/src/types/websockets";
import { Peer } from "../atoms/peers";
import { Stream } from "./stream";

const iceServers = {
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const createRtcPeerConnection = (
  socket: Socket<ServerEvents, ClientEvents>,
  localStream: Stream,
  sid: string,
  setPeers: SetterOrUpdater<Peer[]>
): RTCPeerConnection => {
  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  localStream.stream?.getTracks().forEach((track) => {
    if (localStream.stream === null) {
      return;
    }

    rtcPeerConnection.addTrack(track, localStream.stream);
  });

  rtcPeerConnection.ontrack = (e) => {
    setPeers((peers) => {
      return peers.map((peer) => {
        if (peer.sid !== sid) {
          return peer;
        }

        return { ...peer, streams: e.streams };
      });
    });
  };
  rtcPeerConnection.onicecandidate = (e) => {
    if (e.candidate !== null) {
      socket.emit("webRtcIceCandidate", {
        sid,
        label: e.candidate.sdpMLineIndex,
        candidate: e.candidate.candidate,
      });
    }
  };

  return rtcPeerConnection;
};
