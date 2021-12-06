export interface WebRtcAnswer {
  answerSdp: RTCSessionDescriptionInit;
  sid: string;
}

export interface WebRtcOffer {
  offerSdp: RTCSessionDescriptionInit;
  sid: string;
}

export interface WebRtcIceCandidate {
  candidate: string;
  label: number | null;
  sid: string;
}

export interface ClientEvents {
  joinRoom: (room: string) => void;
  webRtcAnswer: (webRtcAnswer: WebRtcAnswer) => void;
  webRtcIceCandidate: (webRtcIceCandidate: WebRtcIceCandidate) => void;
  webRtcOffer: (webRtcOffer: WebRtcOffer) => void;
}

export interface ServerEvents {
  connected: () => void;
  peerConnect: (sid: string) => void;
  peerDisconnect: (sid: string) => void;
  webRtcAnswer: (webRtcAnswer: WebRtcAnswer) => void;
  webRtcIceCandidate: (webRtcIceCandidate: WebRtcIceCandidate) => void;
  webRtcOffer: (webRtcOffer: WebRtcOffer) => void;
}
