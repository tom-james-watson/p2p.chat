import { atom, SetterOrUpdater } from "recoil";

export type SetPeers = SetterOrUpdater<Peer[]>;

export type Peer = {
  sid: string;
  rtcPeerConnection: RTCPeerConnection;
} & (
  | {
      status: "connecting";
    }
  | {
      status: "connected";
      streams: readonly MediaStream[];
    }
);

export const peersState = atom<Peer[]>({
  key: "peersState",
  default: [],
});
