import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import Container from "../../components/container";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { peersState } from "../../atoms/peers";
import { createSocket } from "../../lib/mesh/websocket";
import { localState } from "../../atoms/local";
import Peers from "../../components/room/peers";
import { roomState } from "../../atoms/room";
import Local from "../../components/room/local";

export default function Room() {
  const router = useRouter();

  const [room, setRoom] = useRecoilState(roomState);
  const setLocal = useSetRecoilState(localState);
  const setPeers = useSetRecoilState(peersState);

  React.useEffect(() => {
    (async () => {
      if (!router.isReady) {
        return;
      }

      const created = router.query.created === "true";
      const roomCode = router.query.roomCode as string;
      const roomName = router.query.roomName as string;

      // TODO - either stop passing this or use it
      console.log({ created });

      try {
        validateRoom(roomCode, roomName);
      } catch (err) {
        setRoom({ status: "error", error: "Invalid room" });
        return;
      }

      setRoom({ status: "ready", name: roomName });
      createSocket(roomCode, setLocal, setPeers);
    })();
  }, [
    router.isReady,
    router.query.roomCode,
    router.query.roomName,
    setPeers,
    setLocal,
  ]);

  return (
    <Container>
      {room.status === "loading" && (
        <Loader type="Oval" color="#006699" height={60} width={60} />
      )}
      {room.status === "error" && <p>{room.error}</p>}
      {room.status === "ready" && (
        <>
          <p>Connected to ${room.name}</p>
          <Local />
          <Peers />
        </>
      )}
    </Container>
  );
}
