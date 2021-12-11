import { atom, SetterOrUpdater } from "recoil";
import { Stream } from "../lib/mesh/stream";

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
