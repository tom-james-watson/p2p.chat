import React from "react";
import GitHubButton from "react-github-btn";
import CreateRoom from "./create-room";

export default function Hero() {
  return (
    <div className="p-4 py-32 text-center hero">
      <h1 className="mb-8 text-6xl font-bold">
        <span className="">p2p</span>
        <span className="text-yellow-500 mx-0.5">.</span>
        <span className="">chat</span>
      </h1>
      <div className="text-3xl mb-24 font-extralight">
        <div className="inline-block">No logins.</div>&nbsp;
        <div className="inline-block">No tracking.</div>&nbsp;
        <div className="inline-block">No nonsense.</div>
      </div>
      <CreateRoom />
      <div>
        <GitHubButton
          href="https://github.com/tom-james-watson/breaktimer-app"
          data-size="large"
          data-show-count="true"
          aria-label="Star tom-james-watson/breaktimer-app on GitHub"
        >
          Star
        </GitHubButton>
      </div>
    </div>
  );
}
