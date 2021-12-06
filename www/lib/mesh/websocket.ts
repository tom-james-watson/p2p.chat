import { io, Socket as IOSocket } from "socket.io-client";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from "../../../lib/src/types/websockets";
import { SetPeers } from "../../atoms/peers";
import { createLocalStream, Stream } from "./stream";
import { createRtcPeerConnection } from "./webrtc";

type Socket = IOSocket<ServerEvents, ClientEvents>;

const onConnected = (socket: Socket, roomCode: string) => () => {
  socket.emit("joinRoom", roomCode);
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

    setPeers((peers) => {
      return [...peers, { rtcPeerConnection, sid, status: "connecting" }];
    });

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
  setPeers: SetPeers
): Promise<void> => {
  const localStream = await createLocalStream();

  const socket: Socket = io("http://localhost:8080");

  socket.on("connected", onConnected(socket, roomCode));
  socket.on("peerConnect", onPeerConnect(socket, localStream, setPeers));
  socket.on("peerDisconnect", onPeerDisconnect(setPeers));
  socket.on("webRtcOffer", onWebRtcOffer(socket, localStream, setPeers));
  socket.on("webRtcAnswer", onWebRtcAnswer(socket, setPeers));
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(setPeers));
};
