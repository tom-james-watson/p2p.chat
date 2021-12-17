import { atom, SetterOrUpdater } from "recoil";
import {
  WebRtcAnswer,
  WebRtcIceCandidate,
} from "../../lib/src/types/websockets";

export type SetPeers = SetterOrUpdater<Peer[]>;

export type Peer = {
  sid: string;
  rtcPeerConnection: RTCPeerConnection;
  stream?: MediaStream;
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
  (sid: string, rtcPeerConnection: RTCPeerConnection) =>
  (peers: Peer[]): Peer[] => {
    return [...peers, { rtcPeerConnection, sid, status: "connecting" }];
  };

const addPeerIceCandidate =
  (webRtcIceCandidate: WebRtcIceCandidate) =>
  (peers: Peer[]): Peer[] => {
    return peers.map((peer) => {
      if (peer.sid !== webRtcIceCandidate.sid) {
        return peer;
      }

      const rtcPeerConnection = peer.rtcPeerConnection;
      rtcPeerConnection.addIceCandidate(
        new RTCIceCandidate({
          sdpMLineIndex: webRtcIceCandidate.label,
          candidate: webRtcIceCandidate.candidate,
        })
      );

      return { ...peer, rtcPeerConnection };
    });
  };

const addPeerTrack =
  (sid: string, stream: MediaStream) =>
  (peers: Peer[]): Peer[] => {
    if (
      !peers.some((peer) => {
        return peer.sid === sid;
      })
    ) {
      throw new Error("no peer found for track");
    }

    return peers.map((peer): Peer => {
      if (peer.sid !== sid) {
        return peer;
      }

      return { ...peer, stream };
    });
  };

const deletePeer =
  (sid: string) =>
  (peers: Peer[]): Peer[] => {
    const peer = peers.find((peer) => peer.sid === sid);

    if (peer === undefined) {
      console.warn("Peer disconnected, but cannot be found in peers");
      return peers;
    }

    peer.rtcPeerConnection.close();

    return peers.filter((peer) => peer.sid !== sid);
  };

const setPeerConnected =
  (sid: string) =>
  (peers: Peer[]): Peer[] => {
    return peers.map((peer): Peer => {
      if (peer.sid !== sid) {
        return peer;
      }

      return { ...peer, status: "connected" };
    });
  };

const setPeerRemoteDescription =
  (webRtcAnswer: WebRtcAnswer) =>
  (peers: Peer[]): Peer[] => {
    return peers.map((peer) => {
      if (peer.sid !== webRtcAnswer.sid) {
        return peer;
      }

      const rtcPeerConnection = peer.rtcPeerConnection;
      rtcPeerConnection.setRemoteDescription(
        new RTCSessionDescription(webRtcAnswer.answerSdp)
      );

      return { ...peer, rtcPeerConnection };
    });
  };

export const peersActions = {
  addPeer,
  addPeerIceCandidate,
  addPeerTrack,
  deletePeer,
  setPeerConnected,
  setPeerRemoteDescription,
};
