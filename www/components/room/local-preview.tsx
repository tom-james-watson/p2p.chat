import React from "react";
import { useRecoilValue } from "recoil";
import { localState } from "../../atoms/local";

export default function LocalPreview() {
  const local = useRecoilValue(localState);

  return (
    <div className="w-full h-48 bg-slate-900 rounded-md">
      {local.status === "requestingDevices" && (
        <video
          ref={(video) => {
            if (video === null) {
              return;
            }
            video.srcObject = local.stream.stream;
          }}
          autoPlay
          muted
          className="w-full h-full object-cover rounded-md scale-x-[-1]"
        />
      )}
    </div>
  );
}
