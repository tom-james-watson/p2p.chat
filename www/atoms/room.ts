import { atom, SetterOrUpdater } from "recoil";

export type SetRoom = SetterOrUpdater<Room>;

export type Room =
  | {
      status: "initializing";
    }
  | {
      status: "connecting";
      name: string;
    }
  | {
      status: "connected";
      name: string;
    };

export const roomState = atom<Room>({
  key: "roomState",
  default: {
    status: "initializing",
  },
});
