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
    let cleanRoomName = cleanSlug(roomName);
    cleanRoomName = cleanRoomName === "" ? randomRoomName() : cleanRoomName;
    const roomCode = createRoomCode(cleanRoomName);
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
      className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-24 justify-center"
      onSubmit={handleSubmit}
    >
      <div className="sm:w-56">
        <Input
          borderless
          handleChange={handleChange}
          placeholder="Enter a room name"
          value={roomName}
        />
      </div>
      <Button
        icon={<PlusCircleIcon width={20} />}
        onClick={submit}
        text="Create room"
      />
    </form>
  );
}
