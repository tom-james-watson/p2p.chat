import assert from "assert";
import React from "react";
import { useRecoilValue } from "recoil";
import { localState } from "../../atoms/local";
import { getVideoAudioEnabled } from "../../lib/mesh/stream";
import GridVideo from "./grid-video";

export default function LocalVideo() {
  const local = useRecoilValue(localState);

  assert(local.status === "connecting" || local.status === "connected");

  const { videoEnabled } = getVideoAudioEnabled(local.stream.stream);

  return (
    <GridVideo
      local
      name={`${local.name} (You)`}
      stream={local.stream.stream}
      videoDisabled={!videoEnabled}
    />
  );
}
