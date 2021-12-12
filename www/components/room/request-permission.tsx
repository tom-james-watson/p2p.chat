import React from "react";
import { useSetRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import { createLocalStream } from "../../lib/mesh/stream";
import PreForm from "./pre-form";

export default function RequestPermission() {
  const setLocal = useSetRecoilState(localState);

  const requestPermissions = React.useCallback(async () => {
    const localStream = await createLocalStream();

    setLocal((local) => {
      if (local.status !== "requestingPermissions") {
        throw new Error(
          "Trying to set requestingDevices whilst in unexpected status"
        );
      }

      return { ...local, stream: localStream, status: "requestingDevices" };
    });
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
