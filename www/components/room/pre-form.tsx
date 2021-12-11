import React from "react";
import Button from "../lib/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  body: React.ReactElement;
  handleSubmit: () => void;
  submitText: string;
}

export default function PreForm(props: Props) {
  const { body, handleSubmit, submitText } = props;

  const _handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <form
      className="flex w-full h-full items-center justify-center text-black"
      onSubmit={_handleSubmit}
    >
      <div className="flex flex-col w-80 rounded-lg bg-white">
        <div className="flex flex-col flex-grow p-4 space-y-2">{body}</div>
        <div className="p-4 border-t border-slate-300">
          <Button text={submitText} onClick={handleSubmit} fill />
        </div>
      </div>
    </form>
  );
}
