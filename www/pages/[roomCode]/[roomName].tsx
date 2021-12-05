import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import Container from "../../components/container";
import { useRouter } from "next/router";
import { validateRoom } from "../../lib/room";

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export default function Room() {
  const router = useRouter();

  const roomCode = router.query.roomCode as string;
  const roomName = router.query.roomName as string;
  const created = router.query.created === "true";

  // TODO - remove?
  console.log({ created });

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    validateRoom(roomCode, roomName);

    const socket: Socket<ServerEvents, ClientEvents> = io(
      "http://localhost:8080"
    );

    socket.on("connected", () => {
      socket.emit("joinRoom", roomCode);
    });

    socket.on("peerConnect", async (sid) => {
      console.log(`peerConnect sid=${sid}`);

      let sessionDescription;
      try {
        const rtcPeerConnection = new RTCPeerConnection(iceServers);
        // addLocalTracks(rtcPeerConnection);
        // rtcPeerConnection.ontrack = setRemoteStream;
        // rtcPeerConnection.onicecandidate = sendIceCandidate;
        sessionDescription = await rtcPeerConnection.createOffer();
        rtcPeerConnection.setLocalDescription(sessionDescription);
      } catch (error) {
        console.error(error);
      }

      socket.emit("webrtc_offer", {
        type: "webrtc_offer",
        sdp: sessionDescription,
        roomId,
      });
    });

    socket.on("peerDisconnect", (sid) => {
      console.log(`peerDisconnect sid=${sid}`);
    });
  }, [roomCode, roomName, router.isReady]);

  return (
    <Container>
      <p>Room {roomName}</p>
    </Container>
  );
}
