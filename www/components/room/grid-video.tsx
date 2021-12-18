import React from "react";
import Loading from "./loading";
import Video from "./video";

interface Props {
  loading?: boolean;
  local?: boolean;
  name?: string;
  stream?: MediaStream | null;
  videoDisabled?: boolean;
}

function Name({ name }: { name?: string }) {
  return (
    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-shadow z-10 sm:text-lg leading-none sm:leading-none">
      {name}
    </div>
  );
}

export default function GridVideo(props: Props) {
  const { loading = false, local = false, name, stream, videoDisabled } = props;

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {!videoDisabled && <Name name={name} />}
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
                <Name name={name} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
