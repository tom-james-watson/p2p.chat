import assert from "assert";
import { atom, SetterOrUpdater } from "recoil";

export const LocalStreamKey = "local";

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
    }
  | {
      status: "connecting";
      name: string;
      audioEnabled: boolean;
      videoEnabled: boolean;
    }
  | {
      status: "connected";
      name: string;
      audioEnabled: boolean;
      videoEnabled: boolean;
    };

export const defaultLocalState: Local = {
  status: "requestingName",
};

export const localState = atom<Local>({
  key: "localState",
  default: defaultLocalState,
});

const setAudioVideoEnabled =
  (audioEnabled: boolean, videoEnabled: boolean) =>
  (local: Local): Local => {
    assert(local.status === "connecting" || local.status === "connected");
    return { ...local, audioEnabled, videoEnabled };
  };

const setConnecting =
  (audioEnabled: boolean, videoEnabled: boolean) =>
  (local: Local): Local => {
    assert(local.status === "requestingDevices");
    return { ...local, status: "connecting", audioEnabled, videoEnabled };
  };

const setRequestingDevices = (local: Local): Local => {
  assert(local.status === "requestingPermissions");
  return { ...local, status: "requestingDevices" };
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

export const localActions = {
  setAudioVideoEnabled,
  setConnecting,
  setRequestingDevices,
  setRequestingPermissions,
  setSocket,
};
