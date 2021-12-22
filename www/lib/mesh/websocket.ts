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
import {
  mapGet,
  rtcDataChannelMap,
  rtcPeerConnectionMap,
  streamMap,
} from "./maps";
import assert from "assert";

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

    if (rtcPeerConnectionMap.get(sid)) {
      console.warn("Received connect from known peer");
      return;
    }

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      local,
      sid,
      setPeers,
      true
    );
    rtcPeerConnectionMap.set(sid, rtcPeerConnection);
    const offerSdp = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(offerSdp);
    setPeers(peersActions.addPeer(sid));

    socket.emit("webRtcOffer", { offerSdp, sid });
  };

const onPeerDisconnect = (setPeers: SetPeers) => (sid: string) => {
  console.debug(`peerDisconnect sid=${sid}`);

  const rtcPeerConnection = rtcPeerConnectionMap.get(sid);
  rtcPeerConnection?.close();
  rtcPeerConnectionMap.delete(sid);

  const rtcDataChannel = rtcDataChannelMap.get(sid);
  rtcDataChannel?.close();
  rtcDataChannelMap.delete(sid);

  streamMap.delete(sid);

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
    rtcPeerConnectionMap.set(sid, rtcPeerConnection);
    setPeers(peersActions.addPeer(sid));
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp));
    const answerSdp = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(answerSdp);

    socket.emit("webRtcAnswer", { answerSdp, sid });
  };

const onWebRtcAnswer = (socket: Socket) => (webRtcAnswer: WebRtcAnswer) => {
  console.debug(`webRtcAnswer fromSid=${socket.id} toSid=${webRtcAnswer.sid}`);
  const rtcPeerConnection = mapGet(rtcPeerConnectionMap, webRtcAnswer.sid);
  rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(webRtcAnswer.answerSdp)
  );
};

const onWebRtcIceCandidate =
  (setPeers: SetPeers) => (webRtcIceCandidate: WebRtcIceCandidate) => {
    const rtcPeerConnection = mapGet(
      rtcPeerConnectionMap,
      webRtcIceCandidate.sid
    );
    console.debug(
      "received ice candidate",
      webRtcIceCandidate.candidate,
      rtcPeerConnection.iceConnectionState
    );
    rtcPeerConnection.addIceCandidate(
      new RTCIceCandidate({
        sdpMLineIndex: webRtcIceCandidate.label,
        candidate: webRtcIceCandidate.candidate,
      })
    );

    if (
      rtcPeerConnection.iceConnectionState === "connected" ||
      rtcPeerConnection.iceConnectionState === "completed"
    ) {
      setPeers(peersActions.setPeerConnected(webRtcIceCandidate.sid));
    }
  };

export const createSocket = async (
  roomCode: string,
  local: Local,
  socketRef: React.MutableRefObject<Socket | undefined>,
  setLocal: SetLocal,
  setPeers: SetPeers
): Promise<void> => {
  assert(process.env.NEXT_PUBLIC_SIGNALLING_URL !== undefined);
  const socket: Socket = io(process.env.NEXT_PUBLIC_SIGNALLING_URL);

  socketRef.current = socket;

  socket.on("connected", onConnected(socket, roomCode, setLocal));
  socket.on("peerConnect", onPeerConnect(socket, local, setPeers));
  socket.on("peerDisconnect", onPeerDisconnect(setPeers));
  socket.on("webRtcOffer", onWebRtcOffer(socket, local, setPeers));
  socket.on("webRtcAnswer", onWebRtcAnswer(socket));
  socket.on("webRtcIceCandidate", onWebRtcIceCandidate(setPeers));
};
