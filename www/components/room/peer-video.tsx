import React from "react";
import { Peer } from "../../atoms/peers";
import GridVideo from "./grid-video";
import Video from "./video";

interface Props {
  peer: Peer;
}

export default function PeerVideo(props: Props) {
  const { peer } = props;

  return (
    <GridVideo>
      <>{peer.status === "connected" && <Video stream={peer.streams[0]} />}</>
    </GridVideo>
  );
}
