import React from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import Button from "../lib/button";
import { cleanSlug, slugify } from "../../lib/rooms/slug";
import { createRoomCode, randomRoomName } from "../../lib/rooms/room-encoding";
import { useRouter } from "next/router";
import Input from "../lib/input";

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

  const handleChange = React.useCallback((value: string) => {
    setRoomName(slugify(value));
  }, []);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    },
    [submit]
  );

  return (
    <form
      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-24 justify-center"
      onSubmit={handleSubmit}
    >
      <Input
        handleChange={handleChange}
        placeholder="Enter a room name"
        value={roomName}
      />
      <Button
        icon={<PlusCircleIcon width={24} />}
        text="Create room"
        onClick={submit}
      />
    </form>
  );
}
