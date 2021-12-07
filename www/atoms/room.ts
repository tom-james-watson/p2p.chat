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

export const roomState = atom<Room>({
  key: "roomState",
  default: {
    status: "loading",
  },
});
