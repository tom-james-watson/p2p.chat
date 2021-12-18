import React from "react";
import { Peer } from "../../atoms/peers";
import { streamMap } from "../../lib/mesh/maps";
import GridVideo from "./grid-video";

interface Props {
  peer: Peer;
}

export default function PeerVideo(props: Props) {
  const { peer } = props;
  const stream = streamMap.get(peer.sid);

  return (
    <GridVideo
      audioDisabled={!peer.audioEnabled}
      loading={peer.status !== "connected"}
      name={peer.name}
      stream={stream}
      videoDisabled={!peer.videoEnabled}
    />
  );
}
