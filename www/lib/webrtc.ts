import { Stream } from "./stream";

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export const createPeerConnection = (
  localStream: Stream
): RTCPeerConnection => {
  const peerConnection = new RTCPeerConnection(iceServers);

  localStream.stream?.getTracks().forEach((track) => {
    if (localStream.stream === null) {
      return;
    }

    peerConnection.addTrack(track, localStream.stream);
  });

  // peerConnection.ontrack = setRemoteStream;
  // peerConnection.onicecandidate = (e) => {
  //   if (e.candidate !== null) {
  //     socket.emit("webrtc_ice_candidate", {
  //       roomId,
  //       label: e.candidate.sdpMLineIndex,
  //       candidate: e.candidate.candidate,
  //     });
  //   }
  // };

  return peerConnection;
};
