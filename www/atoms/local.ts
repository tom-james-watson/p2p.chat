import assert from "assert";
import { atom, SetterOrUpdater } from "recoil";
import { Stream } from "../lib/mesh/stream";
import { Socket } from "../lib/mesh/websocket";

export type SetLocal = SetterOrUpdater<Local>;

export type Local =
  | {
      status: "requestingName";
    }
  | {
      status: "requestingPermissions";
      name: string;
    }
  | {
      status: "requestingDevices";
      name: string;
      stream: Stream;
    }
  | {
      status: "connecting";
      name: string;
      stream: Stream;
    }
  | {
      status: "connected";
      name: string;
      stream: Stream;
    };

export const defaultLocalState: Local = {
  status: "requestingName",
};

export const localState = atom<Local>({
  key: "localState",
  default: defaultLocalState,
});

const cleanup =
  (socketRef: React.MutableRefObject<Socket | undefined>) =>
  (local: Local): Local => {
    // Disconnect from websocket if it exists
    if (socketRef.current !== undefined) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketRef.current.disconnect();
    }

    // Stop any local stream tracks
    if (local.status === "connecting" || local.status === "connected") {
      local.stream.stream?.getTracks().forEach((track) => {
        track.stop();
      });
    }

    return defaultLocalState;
  };

const setConnecting = (local: Local): Local => {
  assert(local.status === "requestingDevices");
  return { ...local, status: "connecting" };
};

const setRequestingDevices =
  (stream: Stream) =>
  (local: Local): Local => {
    assert(local.status === "requestingPermissions");
    return { ...local, stream, status: "requestingDevices" };
  };

const setRequestingPermissions =
  (name: string) =>
  (local: Local): Local => {
    assert(local.status === "requestingName");
    localStorage.setItem("name", name);
    return { ...local, name, status: "requestingPermissions" };
  };

const setSocket = (local: Local): Local => {
  assert(local.status === "connecting" || local.status === "connected");
  return { ...local, status: "connected" };
};

const updateStream =
  (stream: Stream) =>
  (local: Local): Local => {
    assert(local.status === "requestingDevices");
    return { ...local, stream };
  };

export const localActions = {
  cleanup,
  setConnecting,
  setRequestingDevices,
  setRequestingPermissions,
  setSocket,
  updateStream,
};
