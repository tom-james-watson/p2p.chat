export interface WebRtcAnswer {
  answerSdp: RTCSessionDescriptionInit;
  toSid: string;
}

export interface WebRtcOffer {
  offerSdp: RTCSessionDescriptionInit;
  toSid: string;
}

export interface ClientEvents {
  joinRoom: (room: string) => void;
  webRtcAnswer: (webRtcAnswer: WebRtcAnswer) => void;
  webRtcOffer: (webRtcOffer: WebRtcOffer) => void;
}

export interface ServerEvents {
  connected: () => void;
  peerConnect: (sid: string) => void;
  peerDisconnect: (sid: string) => void;
  webRtcAnswer: ({
    answerSdp: RTCSessionDescriptionInit,
    fromSid: string,
  }) => void;
  webRtcOffer: ({
    fromSid: string,
    offerSdp: RTCSessionDescriptionInit,
  }) => void;
}
