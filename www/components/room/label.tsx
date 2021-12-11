import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  htmlFor: string;
  text: string;
}

export default function Label(props: Props) {
  const { htmlFor, text } = props;

  return <label htmlFor={htmlFor}>{text}</label>;
}
