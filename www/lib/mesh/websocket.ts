import { io, Socket as IOSocket } from "socket.io-client";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from "../../../lib/src/types/websockets";
import { SetPeers } from "../../atoms/peers";
import { SetLocal } from "../../atoms/local";
import { Stream } from "./stream";
import { createRtcPeerConnection } from "./webrtc";

const addPeer = (
  sid: string,
  rtcPeerConnection: RTCPeerConnection,
  setPeers: SetPeers
) => {
  setPeers((peers) => {
    return [
      ...peers,
      { rtcPeerConnection, sid, status: "connecting", streams: [] },
    ];
  });
};

type Socket = IOSocket<ServerEvents, ClientEvents>;

const onConnected =
  (socket: Socket, roomCode: string, setLocal: SetLocal) => () => {
    console.debug(`connected`);

    socket.emit("joinRoom", roomCode);

    setLocal((local) => {
      if (local.status !== "connecting") {
        throw new Error("Room connected whilst in unexpected status");
      }

      return { ...local, status: "connected" };
    });
  };

const onPeerConnect =
  (socket: Socket, localStream: Stream, setPeers: SetPeers) =>
  async (sid: string) => {
    console.debug(`peerConnect sid=${sid}`);

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      localStream,
      sid,
      setPeers
    );
    const offerSdp = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offerSdp);

    addPeer(sid, rtcPeerConnection, setPeers);

    socket.emit("webRtcOffer", { offerSdp, sid });
  };

const onPeerDisconnect = (setPeers: SetPeers) => (sid: string) => {
  setPeers((peers) => {
    console.debug(`peerDisconnect sid=${sid}`);
    const peer = peers.find((peer) => peer.sid === sid);

    if (peer === undefined) {
      console.warn("Peer disconnected, but cannot be found in peers");
      return peers;
    }

    peer.rtcPeerConnection.close();

    return peers.filter((peer) => peer.sid !== sid);
  });
};

const onWebRtcOffer =
  (socket: Socket, localStream: Stream, setPeers: SetPeers) =>
  async ({ offerSdp, sid }: WebRtcOffer) => {
    console.debug(`webRtcOffer fromSid=${socket.id} toSid=${sid}`);

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      localStream,
      sid,
      setPeers
    );

    addPeer(sid, rtcPeerConnection, setPeers);

    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp));
    const answerSdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answerSdp);

    socket.emit("webRtcAnswer", {
      answerSdp,
      sid,
    });
  };

const onWebRtcAnswer =
  (socket: Socket, setPeers: SetPeers) =>
  ({ answerSdp, sid }: WebRtcAnswer) => {
    console.debug(`webRtcAnswer fromSid=${socket.id} toSid=${sid}`);

    setPeers((peers) => {
      return peers.map((peer) => {
        if (peer.sid !== sid) {
          return peer;
        }

        const rtcPeerConnection = peer.rtcPeerConnection;
        rtcPeerConnection.setRemoteDescription(
          new RTCSessionDescription(answerSdp)
        );

        return { ...peer, rtcPeerConnection };
      });
    });
  };

const onWebRtcIceCandidate =
  (setPeers: SetPeers) =>
  ({ candidate, label, sid }: WebRtcIceCandidate) => {
    setPeers((peers) => {
      return peers.map((peer) => {
        if (peer.sid !== sid) {
          return peer;
        }

        const rtcPeerConnection = peer.rtcPeerConnection;
        rtcPeerConnection.addIceCandidate(
          new RTCIceCandidate({
            sdpMLineIndex: label,
            candidate: candidate,
          })
        );

        return { ...peer, rtcPeerConnection };
      });
    });
  };

export const createSocket = async (
  roomCode: string,
  localStream: Stream,
  setLocal: SetLocal,
  setPeers: SetPeers
): Promise<void> => {
  // const socket: Socket = io("http://localhost:8080");
  const socket: Socket = io("http://192.168.1.93:8080");

  socket.on("connected", onConnected(socket, roomCode, setLocal));
  socket.on("peerConnect", onPeerConnect(socket, localStream, setPeers));
  socket.on("peerDisconnect", onPeerDisconnect(setPeers));
  socket.on("webRtcOffer", onWebRtcOffer(socket, localStream, setPeers));
  socket.on("webRtcAnswer", onWebRtcAnswer(socket, setPeers));
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(setPeers));
};
