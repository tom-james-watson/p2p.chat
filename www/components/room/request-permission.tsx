import React from "react";
import { useSetRecoilState } from "recoil";
import { localActions, localState, LocalStreamKey } from "../../atoms/local";
import { streamMap } from "../../lib/mesh/maps";
import { createLocalStream } from "../../lib/mesh/stream";
import PreForm from "./pre-form";

export default function RequestPermission() {
  const setLocal = useSetRecoilState(localState);

  const requestPermissions = React.useCallback(async () => {
    const stream = await createLocalStream();
    streamMap.set(LocalStreamKey, stream);
    setLocal(localActions.setRequestingDevices);
  }, [setLocal]);

  return (
    <PreForm
      body={
        <>
          <div>
            To be able to share your camera and microphone, p2p.chat will
            request access to these devices.
          </div>
          <div className="text-slate-500">
            You&apos;ll still be able to stop sharing your devices at any time.
          </div>
        </>
      }
      handleSubmit={requestPermissions}
      submitText="Request permissions"
    />
  );
}
