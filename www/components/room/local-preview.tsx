import assert from "assert";
import React from "react";
import { useRecoilValue } from "recoil";
import { localState } from "../../atoms/local";
import Video from "./video";

export default function LocalPreview() {
  const local = useRecoilValue(localState);

  assert(local.status === "requestingDevices");

  return (
    <div className="w-full h-48 bg-slate-900 rounded-md">
      {local.stream.stream !== null && (
        <Video local stream={local.stream.stream} />
      )}
    </div>
  );
}
