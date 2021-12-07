import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import Container from "../../components/container";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { peersState } from "../../atoms/peers";
import { createSocket } from "../../lib/mesh/websocket";
import { roomState } from "../../atoms/room";

export default function Room() {
  const router = useRouter();

  const created = router.query.created === "true";

  const [room, setRoom] = useRecoilState(roomState);
  const setPeers = useSetRecoilState(peersState);

  // TODO - remove?
  console.log({ created });

  React.useEffect(() => {
    (async () => {
      if (!router.isReady) {
        return;
      }

      const roomCode = router.query.roomCode as string;
      const roomName = router.query.roomName as string;

      try {
        validateRoom(roomCode, roomName);
      } catch (err) {
        setRoom({ status: "error", error: "Invalid room" });
        return;
      }

      setRoom({ status: "connecting", name: roomName });
      createSocket(roomCode, setRoom, setPeers);
    })();
  }, [
    router.isReady,
    router.query.roomCode,
    router.query.roomName,
    setPeers,
    setRoom,
  ]);

  return (
    <Container>
      {room.status === "initializing" && (
        <Loader type="Oval" color="#006699" height={60} width={60} />
      )}
      {room.status === "error" && <p>{room.error}</p>}
      {room.status === "connecting" && <p>Connecting to ${room.name}</p>}
      {room.status === "connected" && (
        <>
          <p>Connected to ${room.name}</p>
        </>
      )}
    </Container>
  );
}
