import React from "react";
import { useSetRecoilState } from "recoil";
import { localState } from "../../atoms/local";
import Input from "../lib/input";
import PreForm from "./pre-form";

export default function RequestName() {
  const setLocal = useSetRecoilState(localState);
  const [name, setName] = React.useState("");

  const submitName = React.useCallback(() => {
    setLocal((local) => {
      if (local.status !== "requestingName") {
        throw new Error("Trying to set connecting whilst in unexpected status");
      }

      return { ...local, name, status: "requestingPermissions" };
    });
  }, [name, setLocal]);

  return (
    <PreForm
      body={
        <>
          <label className="text-slate-500" htmlFor="name">
            Your name
          </label>
          <Input
            handleChange={setName}
            id="name"
            placeholder="Enter your name"
            value={name}
          />
        </>
      }
      handleSubmit={submitName}
      submitText="Continue"
    />
  );
}
