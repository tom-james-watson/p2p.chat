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
  const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream);

  return (
    <GridVideo
      audioDisabled={!audioEnabled}
      local
      name={`${local.name} (You)`}
      stream={stream}
      videoDisabled={!videoEnabled}
    />
  );
}
