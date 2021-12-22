import { atom, SetterOrUpdater } from "recoil";

export type SetPeers = SetterOrUpdater<Peer[]>;

export type Peer = {
  name?: string;
  sid: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
} & (
  | {
      status: "connecting";
    }
  | {
      status: "connected";
    }
);

export const defaultPeersState: Peer[] = [];

export const peersState = atom<Peer[]>({
  key: "peersState",
  default: defaultPeersState,
});

const addPeer =
  (sid: string) =>
  (peers: Peer[]): Peer[] => {
    return [
      ...peers,
      {
        sid,
        status: "connecting",
        audioEnabled: false,
        videoEnabled: false,
      },
    ];
  };

const deletePeer =
  (sid: string) =>
  (peers: Peer[]): Peer[] => {
    const peer = peers.find((peer) => peer.sid === sid);

    if (peer === undefined) {
      console.warn("Peer disconnected, but cannot be found in peers");
      return peers;
    }

    return peers.filter((peer) => peer.sid !== sid);
  };

const setPeerConnected =
  (sid: string) =>
  (peers: Peer[]): Peer[] => {
    console.debug(`peer fully connected ${sid}`);

    return peers.map((peer): Peer => {
      if (peer.sid !== sid) {
        return peer;
      }

      return { ...peer, status: "connected" };
    });
  };

const setPeerState =
  (sid: string, name: string, audioEnabled: boolean, videoEnabled: boolean) =>
  (peers: Peer[]): Peer[] => {
    return peers.map((peer): Peer => {
      if (peer.sid !== sid) {
        return peer;
      }

      return { ...peer, name, audioEnabled, videoEnabled };
    });
  };

export const peersActions = {
  addPeer,
  deletePeer,
  setPeerConnected,
  setPeerState,
};
