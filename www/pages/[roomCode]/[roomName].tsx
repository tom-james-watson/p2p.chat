import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import Container from "../../components/container";
import { useRouter } from "next/router";
import { validateRoom } from "../../lib/room-encoding";
import { createPeerConnection } from "../../lib/webrtc";
import { createLocalStream } from "../../lib/stream";

export default function Room() {
  const router = useRouter();

  const roomCode = router.query.roomCode as string;
  const roomName = router.query.roomName as string;
  const created = router.query.created === "true";

  // TODO - remove?
  console.log({ created });

  React.useEffect(() => {
    (async () => {
      if (!router.isReady) {
        return;
      }

      const localStream = await createLocalStream();

      validateRoom(roomCode, roomName);

      const socket: Socket<ServerEvents, ClientEvents> = io(
        "http://localhost:8080"
      );

      socket.on("connected", () => {
        socket.emit("joinRoom", roomCode);
      });

      socket.on("peerConnect", async (sid) => {
        console.log(`peerConnect sid=${sid}`);

        const peerConnection = createPeerConnection(localStream);
        const offerSdp = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offerSdp);

        socket.emit("webRtcOffer", { offerSdp, toSid: sid });
      });

      socket.on("peerDisconnect", (sid) => {
        console.log(`peerDisconnect sid=${sid}`);
      });

      socket.on("webRtcAnswer", async ({ answerSdp, fromSid }) => {
        // TODO:
        // - need to store the peers in state so that we can access the peer here.
        // - handle ice candidate logic on callbacks
        // rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(foo))
      });

      socket.on("webRtcOffer", async ({ fromSid, offerSdp }) => {
        const peerConnection = createPeerConnection(localStream);
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(offerSdp)
        );

        const answerSdp = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answerSdp);

        socket.emit("webRtcAnswer", {
          answerSdp,
          toSid: fromSid,
        });
      });
    })();
  }, [roomCode, roomName, router.isReady]);

  return (
    <Container>
      <p>Room {roomName}</p>
    </Container>
  );
}
