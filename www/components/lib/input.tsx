import React from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  handleChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  value: string;
}

export default function Input(props: Props) {
  const { handleChange, id, placeholder, value } = props;

  const _handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.value);
    },
    [handleChange]
  );

  return (
    <input
      className="p-2 text-black rounded shadow sm:w-56 shadow-white-500/50"
      id={id}
      onChange={_handleChange}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}
