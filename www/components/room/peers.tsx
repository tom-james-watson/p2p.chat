import React from "react";
import { useRecoilValue } from "recoil";
import { peersState } from "../../atoms/peers";

export default function Peers() {
  const peers = useRecoilValue(peersState);

  return (
    <>
      {peers.map((peer) => {
        console.log({ peer });
        return (
          <div key={peer.sid}>
            {peer.sid}
            {peer.status}
            {peer.streams.length}
            {peer.status === "connected" && (
              <video
                ref={(video) => {
                  if (video === null) {
                    return;
                  }
                  video.srcObject = peer.streams[0];
                }}
                width={400}
                height={300}
                autoPlay
              />
            )}
          </div>
        );
      })}
    </>
  );
}
