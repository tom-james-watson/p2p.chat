import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactElement;
  text: string;
}

export default function Button(props: Props) {
  const { icon, text, ...rest } = props;

  return (
    <button
      type="button"
      className="flex flex-row space-x-2 items-center justify-center rounded p-2 px-4 font-medium bg-indigo-500 shadow-md shadow-indigo-500/50 hover:bg-indigo-600 hover:shadow-indigo-600/50 active:bg-indigo-700 active:shadow-indigo-700/50"
      {...rest}
    >
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}
