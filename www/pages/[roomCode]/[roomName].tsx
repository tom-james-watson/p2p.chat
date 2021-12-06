import React from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../../lib/src/types/websockets";
import Container from "../../components/container";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { createRtcPeerConnection } from "../../lib/mesh/webrtc";
import { createLocalStream } from "../../lib/mesh/stream";
import { peersState } from "../../atoms/peers";

export default function Room() {
  const router = useRouter();

  const roomCode = router.query.roomCode as string;
  const roomName = router.query.roomName as string;
  const created = router.query.created === "true";

  const setPeers = useSetRecoilState(peersState);

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
      });

      socket.on("peerDisconnect", (sid) => {
        console.log(`peerDisconnect sid=${sid}`);
      });

      socket.on("webRtcAnswer", async ({ answerSdp, sid }) => {
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
      });

      socket.on("webRtcIceCandidate", async ({ candidate, label, sid }) => {
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
      });

      socket.on("webRtcOffer", async ({ offerSdp, sid }) => {
        const rtcPeerConnection = createRtcPeerConnection(
          socket,
          localStream,
          sid,
          setPeers
        );
        rtcPeerConnection.setRemoteDescription(
          new RTCSessionDescription(offerSdp)
        );

        const answerSdp = await rtcPeerConnection.createAnswer();
        rtcPeerConnection.setLocalDescription(answerSdp);

        socket.emit("webRtcAnswer", {
          answerSdp,
          sid,
        });
      });
    })();
  }, [roomCode, roomName, router.isReady, setPeers]);

  return (
    <Container>
      <p>Room {roomName}</p>
    </Container>
  );
}
