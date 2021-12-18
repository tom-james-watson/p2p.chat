export const rtcPeerConnectionMap = new Map<string, RTCPeerConnection>();
export const rtcDataChannelMap = new Map<string, RTCDataChannel>();
export const streamMap = new Map<string, MediaStream | null>();

export const mapGet = <K, V>(map: Map<K, V>, key: K): V => {
  const v = map.get(key);

  if (v === undefined) {
    throw new Error("Failed to find key in map");
  }

  return v;
};
