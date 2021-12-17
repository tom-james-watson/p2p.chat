import React from "react";

interface Props {
  children: React.ReactElement;
  name?: string;
}

export default function GridVideo(props: Props) {
  const { children, name } = props;

  return (
    <div className="w-full h-full relative">
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-shadow z-10 sm:text-lg leading-none sm:leading-none">
        {name}
      </div>
      {children}
    </div>
  );
}
