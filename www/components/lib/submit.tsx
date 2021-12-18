import classNames from "classnames";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  fill?: boolean;
  text: string;
}

export default function Submit(props: Props) {
  const { fill = false, text, ...rest } = props;

  const className = classNames(
    "flex flex-row space-x-2 items-center justify-center rounded-md p-2 px-4 text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:outline focus:outline-yellow-500 cursor-pointer",
    {
      "w-full": fill,
    }
  );

  return (
    <input type="submit" className={className} {...rest} value={text}></input>
  );
}
