import { atom, SetterOrUpdater } from "recoil";

export type SetRoom = SetterOrUpdater<Room>;

export type Room =
  | {
      status: "loading";
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "ready";
      name: string;
    };

export const defaultRoomState: Room = {
  status: "loading",
};

export const roomState = atom<Room>({
  key: "roomState",
  default: defaultRoomState,
});

const setError = (): Room => {
  return { status: "error", error: "Invalid room" };
};

const setReady = (roomName: string) => (): Room => {
  return { status: "ready", name: roomName };
};

export const roomActions = {
  setError,
  setReady,
};
