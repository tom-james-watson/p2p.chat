import React from "react";
import classNames from "classnames";

interface Props {
  local?: boolean;
  stream: MediaStream;
}

export default function Video(props: Props) {
  const { local = false, stream } = props;

  // return <div className="h-full w-full object-cover rounded-md bg-red-500" />;

  const className = classNames("h-full w-full object-cover rounded-md", {
    "scale-x-[-1]": local,
  });

  // return (
  //   <img
  //     src="https://images.english.elpais.com/resizer/ET_C6J8LTA-oF2-e0ILqkYdTmEk=/1200x0/filters:focal(1052x792:1062x802)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/IPZM424KYBEH7IVUKNQZETWHVU.jpg"
  //     className={className}
  //   />
  // );

  return (
    <video
      ref={(video) => {
        if (video === null) {
          return;
        }
        video.srcObject = stream;
      }}
      tabIndex={-1}
      autoPlay
      muted={local}
      className={className}
    />
  );
}
