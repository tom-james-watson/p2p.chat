import React from "react";

interface Props {
  children: React.ReactElement;
}

export default function GridVideo(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
