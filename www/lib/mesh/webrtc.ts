import { SetterOrUpdater } from "recoil";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import { Peer } from "../../atoms/peers";
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
    console.debug("ontrack", e.streams.length);
    setPeers((peers) => {
      if (
        !peers.some((peer) => {
          return peer.sid === sid;
        })
      ) {
        throw new Error("no peer found for track");
      }

      return peers.map((peer): Peer => {
        if (peer.sid !== sid) {
          return peer;
        }

        return {
          ...peer,
          streams: [...peer.streams, ...e.streams],
        };
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

    if (
      rtcPeerConnection.iceConnectionState === "connected" ||
      rtcPeerConnection.iceConnectionState === "completed"
    ) {
      setPeers((peers) => {
        return peers.map((peer): Peer => {
          if (peer.sid !== sid) {
            return peer;
          }

          console.debug(`peer fully connected ${peer.sid}`);
          return { ...peer, status: "connected" };
        });
      });
    }
  };

  return rtcPeerConnection;
};
