import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { validateRoom } from "../../lib/rooms/room-encoding";
import { createSocket, Socket } from "../../lib/mesh/websocket";
import { defaultLocalState, localState } from "../../atoms/local";
import { defaultPeersState, peersState } from "../../atoms/peers";
import { defaultRoomState, roomActions, roomState } from "../../atoms/room";
import RequestName from "../../components/room/request-name";
import RequestPermission from "../../components/room/request-permission";
import RequestDevices from "../../components/room/request-devices";
import Loading from "../../components/room/loading";
import Call from "../../components/room/call";
import {
  rtcDataChannelMap,
  rtcPeerConnectionMap,
  streamMap,
} from "../../lib/mesh/maps";

export default function Room() {
  const router = useRouter();

  const [local, setLocal] = useRecoilState(localState);
  const setPeers = useSetRecoilState(peersState);
  const [room, setRoom] = useRecoilState(roomState);
  const socketRef = React.useRef<Socket>();

  // Parse and validate room from url
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
        setRoom(roomActions.setError);
        return;
      }

      setRoom(roomActions.setReady(roomName));
    })();
  }, [router, setRoom]);

  // Clean up on unmount, which only happens on navigating to another page
  React.useEffect(() => {
    return () => {
      // Reset app state
      setPeers(defaultPeersState);
      setRoom(defaultRoomState);
      setLocal(defaultLocalState);

      if (socketRef.current !== undefined) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        socketRef.current.disconnect();
      }

      streamMap.forEach((stream, key) => {
        stream?.getTracks().forEach((track) => {
          track.stop();
        });
        streamMap.delete(key);
      });

      rtcDataChannelMap.forEach((channel, sid) => {
        channel.close();
        rtcDataChannelMap.delete(sid);
      });

      rtcPeerConnectionMap.forEach((rtcPeerConnection, sid) => {
        rtcPeerConnection.close();
        rtcPeerConnectionMap.delete(sid);
      });
    };
  }, [setLocal, setPeers, setRoom]);

  React.useEffect(() => {
    (async () => {
      if (local.status === "connecting") {
        const roomCode = router.query.roomCode as string;
        createSocket(roomCode, local, socketRef, setLocal, setPeers);
      }
    })();
  }, [local, router.query.roomCode, setLocal, setPeers]);

  return (
    <div className="h-full w-full max-h-full max-w-full overflow-hidden">
      {room.status === "loading" && <Loading />}
      {room.status === "error" && <p>{room.error}</p>}
      {room.status === "ready" && (
        <>
          {local.status === "requestingName" && <RequestName />}
          {local.status === "requestingPermissions" && <RequestPermission />}
          {local.status === "requestingDevices" && <RequestDevices />}
          {local.status === "connecting" && <Loading />}
          {local.status === "connected" && <Call />}
        </>
      )}
    </div>
  );
}
