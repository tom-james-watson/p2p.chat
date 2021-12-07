import { atom, SetterOrUpdater } from "recoil";
import { Stream } from "../lib/mesh/stream";

export type SetLocal = SetterOrUpdater<Local>;

export type Local =
  | {
      status: "initializing";
    }
  | {
      status: "connecting";
      stream: Stream;
    }
  | {
      status: "connected";
      stream: Stream;
    };

export const localState = atom<Local>({
  key: "localState",
  default: {
    status: "initializing",
  },
});
