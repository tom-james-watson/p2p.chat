import React from "react";
import GitHubButton from "react-github-btn";
import CreateRoom from "./create-room";

export default function Hero() {
  return (
    <div className="hero py-32 p-4 text-center">
      <h1 className="text-5xl font-bold mb-4">
        <span className="">p2p</span>
        <span className="text-yellow-400 mx-0.5">.</span>
        <span className="">chat</span>
      </h1>
      <h3 className="text-2xl mb-16">No logins. No tracking. No nonsense.</h3>
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
