import React from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import Button from "../lib/button";
import { cleanSlug, slugify } from "../../lib/slug";
import { createRoomCode, randomRoomName } from "../../lib/room";
import { useRouter } from "next/router";

export default function CreateRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = React.useState("");

  const submit = React.useCallback(() => {
    const cleanRoomName = cleanSlug(roomName);
    const roomCode = createRoomCode(
      cleanRoomName === "" ? randomRoomName() : cleanRoomName
    );
    router.push(
      `/${roomCode}/${cleanRoomName}?created=true`,
      `/${roomCode}/${cleanRoomName}`
    );
  }, [roomName, router]);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRoomName(slugify(e.target.value));
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
      className="flex flex-row space-x-2 mb-16 justify-center"
      onSubmit={onSubmit}
    >
      <input
        className="rounded p-2 text-black w-56"
        onChange={onChange}
        placeholder="e.g. engineering standup"
        type="text"
        value={roomName}
      />
      <Button
        icon={<PlusCircleIcon width={24} />}
        text="Create room"
        onClick={() => {
          console.log("click");
          submit();
        }}
      />
    </form>
  );
}
