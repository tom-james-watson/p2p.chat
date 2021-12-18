import { MicrophoneIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import React from "react";
import Loading from "./loading";
import Video from "./video";

interface StatusProps {
  audioDisabled: boolean;
  name?: string;
  videoDisabled: boolean;
}

function Status(props: StatusProps) {
  const { audioDisabled, name, videoDisabled } = props;

  const className = classNames(
    "absolute flex items-center space-x-2 bottom-2 left-2 text-shadow z-10 sm:text-lg leading-none sm:leading-none max-w-full",
    {
      "sm:bottom-4 sm:left-4": !videoDisabled,
    }
  );

  const audioIconClassName = classNames("absolute", {
    "text-red-500": audioDisabled,
  });

  return (
    <div className={className}>
      <MicrophoneIcon width={20} className={audioIconClassName} />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap pl-5 pr-4">
        {name}
      </span>
    </div>
  );
}

interface Props {
  audioDisabled: boolean;
  loading?: boolean;
  local?: boolean;
  name?: string;
  stream?: MediaStream | null;
  videoDisabled: boolean;
}

export default function GridVideo(props: Props) {
  const {
    audioDisabled,
    loading = false,
    local = false,
    name,
    stream,
    videoDisabled,
  } = props;

  const status = (
    <Status
      audioDisabled={audioDisabled}
      name={name}
      videoDisabled={videoDisabled}
    />
  );

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {!videoDisabled && status}
          {stream && (
            <Video
              local={local}
              videoDisabled={videoDisabled}
              stream={stream}
            />
          )}
          {videoDisabled && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex items-center justify-center w-40 h-40 bg-indigo-500 rounded-md relative">
                {status}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
