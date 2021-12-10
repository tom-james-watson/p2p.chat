import classNames from "classnames";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactElement;
  fill?: boolean;
  text: string;
}

export default function Button(props: Props) {
  const { icon, fill = false, text, ...rest } = props;

  const className = classNames(
    "flex flex-row space-x-2 items-center justify-center rounded-md p-2 px-4 text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:outline focus:outline-yellow-500",
    {
      "w-full": fill,
    }
  );

  return (
    <button type="button" className={className} {...rest}>
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}
