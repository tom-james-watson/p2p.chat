import React from "react";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Container from "../../components/container";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { peersState } from "../../atoms/peers";
import { createSocket } from "../../lib/mesh/websocket";

export default function Room() {
  const router = useRouter();

  const created = router.query.created === "true";

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

      // TODO - do something with errors here
      validateRoom(roomCode, roomName);

      createSocket(roomCode, setPeers);
    })();
  }, [router.isReady, router.query.roomCode, router.query.roomName, setPeers]);

  return (
    <Container>
      <p>Room</p>
    </Container>
  );
}
