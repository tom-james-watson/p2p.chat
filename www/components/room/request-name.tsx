import React from "react";
import { useSetRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import Button from "../lib/button";

export default function RequestName() {
  const setLocal = useSetRecoilState(localState);
  const [name, setName] = React.useState("");

  const submit = React.useCallback(() => {
    setLocal((local) => {
      if (local.status !== "requestingName") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      return { ...local, name, status: "requestingPermissions" };
    });
  }, [name, setLocal]);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    },
    [submit]
  );

  return (
    <form
      className="flex flex-col space-y-2 justify-center h-96"
      onSubmit={onSubmit}
    >
      <label htmlFor="name-input">Your name</label>
      <input
        id="name-input"
        className="w-56 p-2 text-black rounded"
        onChange={onChange}
        placeholder="Enter your name"
        type="text"
        value={name}
      />
      <Button text="Continue" onClick={submit} />
    </form>
  );
}
