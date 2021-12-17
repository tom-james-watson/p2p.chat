import React from "react";
import { Peer } from "../../atoms/peers";
import GridVideo from "./grid-video";
import Video from "./video";

interface Props {
  peer: Peer;
}

export default function PeerVideo(props: Props) {
  const { peer } = props;

  // Note that waiting for peer.status to be "connected" means that we are
  // waiting for ice negotiation to finish before displaying the video. If we
  // see slowness on the video appearing, that is probably why and we can look
  // into displaying the video earlier.
  return (
    <GridVideo>
      <>
        {peer.status === "connected" && peer.stream !== undefined && (
          <Video stream={peer.stream} />
        )}
      </>
    </GridVideo>
  );
}
