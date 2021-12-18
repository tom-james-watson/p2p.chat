import classNames from "classnames";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  color?: "indigo" | "slate" | "red";
  icon?: React.ReactElement;
  fill?: boolean;
  square?: boolean;
  text?: string;
}

export default function Button(props: Props) {
  const {
    color = "indigo",
    icon,
    fill = false,
    square = false,
    text,
    ...rest
  } = props;

  const className = classNames(
    `flex flex-row space-x-2 items-center justify-center rounded-md p-2 px-4 text-white focus:outline focus:outline-yellow-500 relative`,
    {
      "w-full": fill,
      "w-10 h-10": square,
      "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700":
        color === "indigo",
      "bg-slate-700 hover:bg-slate-600 active:bg-slate-500": color === "slate",
      "bg-red-500 hover:bg-red-600 active:bg-red-700": color === "red",
    }
  );

  return (
    <button type="button" className={className} {...rest}>
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}
