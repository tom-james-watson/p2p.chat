import { atom, SetterOrUpdater } from "recoil";

export type SetPeers = SetterOrUpdater<Peer[]>;

export type Peer = {
  sid: string;
  rtcPeerConnection: RTCPeerConnection;
  streams: readonly MediaStream[];
} & (
  | {
      status: "connecting";
    }
  | {
      status: "connected";
    }
);

export const peersState = atom<Peer[]>({
  key: "peersState",
  default: [],
});
