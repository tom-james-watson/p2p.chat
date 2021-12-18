import React from "react";
import { LocalStreamKey } from "../../atoms/local";
import { mapGet, streamMap } from "../../lib/mesh/maps";
import Video from "./video";

export default function LocalPreview() {
  const stream = mapGet(streamMap, LocalStreamKey);

  return (
    <div className="w-full h-48 bg-slate-900 rounded-md">
      {stream !== null && <Video local stream={stream} />}
    </div>
  );
}
