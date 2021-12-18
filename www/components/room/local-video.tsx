import assert from "assert";
import React from "react";
import { useRecoilValue } from "recoil";
import { localState, LocalStreamKey } from "../../atoms/local";
import { mapGet, streamMap } from "../../lib/mesh/maps";
import { getVideoAudioEnabled } from "../../lib/mesh/stream";
import GridVideo from "./grid-video";

export default function LocalVideo() {
  const local = useRecoilValue(localState);

  assert(local.status === "connecting" || local.status === "connected");
  const stream = mapGet(streamMap, LocalStreamKey);
  const { videoEnabled } = getVideoAudioEnabled(stream);

  return (
    <GridVideo
      local
      name={`${local.name} (You)`}
      stream={stream}
      videoDisabled={!videoEnabled}
    />
  );
}
