import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import Container from "../../components/container";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { peersState } from "../../atoms/peers";
import { createSocket } from "../../lib/mesh/websocket";
import { localState } from "../../atoms/local";
import { roomState } from "../../atoms/room";
import RequestName from "../../components/room/request-name";
import RequestPermission from "../../components/room/request-permission";
import Local from "../../components/room/local";
import Peers from "../../components/room/peers";

export default function Room() {
  const router = useRouter();

  const [room, setRoom] = useRecoilState(roomState);
  const [local, setLocal] = useRecoilState(localState);
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
    })();
  }, [router.isReady, router.query, setRoom]);

  React.useEffect(() => {
    (async () => {
      if (local.status === "connecting") {
        const roomCode = router.query.roomCode as string;
        createSocket(roomCode, local.stream, setLocal, setPeers);
      }
    })();
  }, [local, router.query.roomCode, setLocal, setPeers]);

  console.log({ local });

  return (
    <div className="h-full w-full max-h-full max-w-full overflow-hidden">
      <Container>
        {room.status === "loading" && (
          <Loader type="Oval" color="#006699" height={60} width={60} />
        )}
        {room.status === "error" && <p>{room.error}</p>}
        {room.status === "ready" && (
          <>
            {local.status === "requestingName" && <RequestName />}
            {local.status === "requestingPermissions" && <RequestPermission />}
            {local.status === "connecting" && (
              <Loader type="Oval" color="#006699" height={60} width={60} />
            )}
            {local.status === "connected" && (
              <>
                <p>Connected to ${room.name}</p>
                <Local />
                <Peers />
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
