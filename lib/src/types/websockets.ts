export interface ClientEvents {
  joinRoom: (room: string) => void;
}

export interface ServerEvents {
  connected: () => void;
  peerConnect: (sid: string) => void;
  peerDisconnect: (sid: string) => void;
}
