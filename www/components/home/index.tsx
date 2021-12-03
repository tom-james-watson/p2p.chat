import React from "react";
import Hero from "./hero";
import { io } from "socket.io-client";

export default function Home() {
  React.useEffect(() => {
    const socket = io("http://localhost:8080");
    // use your socket
    socket.on("welcome", (message) => {
      console.log({ message });
      // do something with the message.
    });
  }, []);

  return (
    <div>
      <Hero />
    </div>
  );
}
