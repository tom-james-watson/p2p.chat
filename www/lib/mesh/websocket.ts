import { io, Socket as IOSocket } from "socket.io-client";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from "../../../lib/src/types/websockets";
import { SetPeers } from "../../atoms/peers";
import { SetRoom } from "../../atoms/room";
import { createLocalStream, Stream } from "./stream";
import { createRtcPeerConnection } from "./webrtc";

const addPeer = (
  sid: string,
  rtcPeerConnection: RTCPeerConnection,
  setPeers: SetPeers
) => {
  setPeers((peers) => {
    return [...peers, { rtcPeerConnection, sid, status: "connecting" }];
  });
};

type Socket = IOSocket<ServerEvents, ClientEvents>;

const onConnected =
  (socket: Socket, roomCode: string, setRoom: SetRoom) => () => {
    console.debug(`connected`);

    socket.emit("joinRoom", roomCode);

    setRoom((room) => {
      if (room.status !== "connecting") {
        throw new Error("Room connected whilst in unexpected status");
      }

      return { ...room, status: "connected" };
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
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp));

    const answerSdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answerSdp);

    addPeer(sid, rtcPeerConnection, setPeers);

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
      console.log(2, { peers });
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
      console.log(1, { peers });
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
  setRoom: SetRoom,
  setPeers: SetPeers
): Promise<void> => {
  const localStream = await createLocalStream();

  const socket: Socket = io("http://localhost:8080");

  socket.on("connected", onConnected(socket, roomCode, setRoom));
  socket.on("peerConnect", onPeerConnect(socket, localStream, setPeers));
  socket.on("peerDisconnect", onPeerDisconnect(setPeers));
  socket.on("webRtcOffer", onWebRtcOffer(socket, localStream, setPeers));
  socket.on("webRtcAnswer", onWebRtcAnswer(socket, setPeers));
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(setPeers));
};
