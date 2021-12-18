import React from "react";
import { Peer } from "../../atoms/peers";
import GridVideo from "./grid-video";

interface Props {
  peer: Peer;
}

export default function PeerVideo(props: Props) {
  const { peer } = props;

  return (
    <GridVideo
      loading={peer.status !== "connected"}
      name={peer.name}
      stream={peer.stream}
      videoDisabled={!peer.videoEnabled}
    />
  );
}
