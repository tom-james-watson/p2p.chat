import React from "react";
import { useSetRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import Button from "../lib/button";
import Input from "../lib/input";

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
      <label htmlFor="name">Your name</label>
      <Input
        handleChange={setName}
        id="name"
        placeholder="Enter your name"
        value={name}
      />
      <Button text="Continue" onClick={submit} />
    </form>
  );
}
