import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
  text: string;
}

export default function Button(props: Props) {
  const { icon, text, ...rest } = props;

  return (
    <button
      type="button"
      className="flex flex-row space-x-2 items-center justify-center rounded p-2 px-4 font-medium bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"
      {...rest}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
