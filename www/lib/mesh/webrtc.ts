import { SetterOrUpdater } from "recoil";
import { Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import { Peer, peersActions } from "../../atoms/peers";
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
  setPeers: SetterOrUpdater<Peer[]>,
  creator: boolean
): RTCPeerConnection => {
  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  localStream.stream?.getTracks().forEach((track) => {
    if (localStream.stream === null) {
      return;
    }

    rtcPeerConnection.addTrack(track, localStream.stream);
  });

  rtcPeerConnection.ontrack = (e) => {
    setPeers(peersActions.addPeerTrack(sid, e.streams));
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
    const dataChannel = rtcPeerConnection.createDataChannel("data");

    dataChannel.onopen = function (event) {
      dataChannel.send("Hi you!");
    };

    dataChannel.onmessage = function (event) {
      console.log(event.data);
    };
  }

  // TODO - refactor this function so that it's a promise that only resolves
  // once we have a datachannel that we can also save to the peer store.
  rtcPeerConnection.ondatachannel = function (event) {
    const channel = event.channel;
    channel.onopen = function (event) {
      channel.send("Hi back!");
    };
    channel.onmessage = function (event) {
      console.log(event.data);
    };
  };

  return rtcPeerConnection;
};
