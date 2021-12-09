import React from "react";
import { useRecoilValue } from "recoil";
import { localState } from "../../atoms/local";

export default function Local() {
  const local = useRecoilValue(localState);

  return (
    <>
      <div>
        {local.status}
        {(local.status === "connecting" || local.status === "connected") && (
          <video
            ref={(video) => {
              if (video === null) {
                return;
              }
              video.srcObject = local.stream.stream;
            }}
            width={400}
            height={300}
            autoPlay
          />
        )}
      </div>
    </>
  );
}
