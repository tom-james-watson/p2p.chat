import { io, Socket as IOSocket } from "socket.io-client";
import {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from "../../../lib/src/types/websockets";
import { peersActions, SetPeers } from "../../atoms/peers";
import { Local, localActions, SetLocal } from "../../atoms/local";
import { createRtcPeerConnection } from "./webrtc";

export type Socket = IOSocket<ServerEvents, ClientEvents>;

const onConnected =
  (socket: Socket, roomCode: string, setLocal: SetLocal) => () => {
    console.debug(`connected`);
    socket.emit("joinRoom", roomCode);
    setLocal(localActions.setSocket);
  };

const onPeerConnect =
  (socket: Socket, local: Local, setPeers: SetPeers) => async (sid: string) => {
    console.debug(`peerConnect sid=${sid}`);

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      local,
      sid,
      setPeers,
      true
    );
    const offerSdp = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offerSdp);
    setPeers(peersActions.addPeer(sid, rtcPeerConnection));

    socket.emit("webRtcOffer", { offerSdp, sid });
  };

const onPeerDisconnect = (setPeers: SetPeers) => (sid: string) => {
  console.debug(`peerDisconnect sid=${sid}`);
  setPeers(peersActions.deletePeer(sid));
};

const onWebRtcOffer =
  (socket: Socket, local: Local, setPeers: SetPeers) =>
  async ({ offerSdp, sid }: WebRtcOffer) => {
    console.debug(`webRtcOffer fromSid=${socket.id} toSid=${sid}`);

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      local,
      sid,
      setPeers,
      false
    );
    setPeers(peersActions.addPeer(sid, rtcPeerConnection));
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp));
    const answerSdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answerSdp);

    socket.emit("webRtcAnswer", { answerSdp, sid });
  };

const onWebRtcAnswer =
  (socket: Socket, setPeers: SetPeers) => (webRtcAnswer: WebRtcAnswer) => {
    console.debug(
      `webRtcAnswer fromSid=${socket.id} toSid=${webRtcAnswer.sid}`
    );
    setPeers(peersActions.setPeerRemoteDescription(webRtcAnswer));
  };

const onWebRtcIceCandidate =
  (setPeers: SetPeers) => (webRtcIceCandidate: WebRtcIceCandidate) => {
    setPeers(peersActions.addPeerIceCandidate(webRtcIceCandidate));
  };

export const createSocket = async (
  roomCode: string,
  local: Local,
  socketRef: React.MutableRefObject<Socket | undefined>,
  setLocal: SetLocal,
  setPeers: SetPeers
): Promise<void> => {
  // const socket: Socket = io("http://localhost:8080");
  const socket: Socket = io("http://192.168.1.93:8080");

  socketRef.current = socket;

  socket.on("connected", onConnected(socket, roomCode, setLocal));
  socket.on("peerConnect", onPeerConnect(socket, local, setPeers));
  socket.on("peerDisconnect", onPeerDisconnect(setPeers));
  socket.on("webRtcOffer", onWebRtcOffer(socket, local, setPeers));
  socket.on("webRtcAnswer", onWebRtcAnswer(socket, setPeers));
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(setPeers));
};
