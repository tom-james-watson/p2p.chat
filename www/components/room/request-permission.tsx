import React from "react";
import { useSetRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import { createLocalStream } from "../../lib/mesh/stream";
import Button from "../lib/button";

export default function RequestPermission() {
  const setLocal = useSetRecoilState(localState);

  const handleClick = React.useCallback(async () => {
    const localStream = await createLocalStream();

    setLocal((local) => {
      if (local.status !== "requestingPermissions") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      return { ...local, stream: localStream, status: "connecting" };
    });
  }, [setLocal]);

  return (
    <>
      <Button text="Request permissions" onClick={handleClick} />
    </>
  );
}
