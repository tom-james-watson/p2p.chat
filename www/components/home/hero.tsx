import React from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import GitHubButton from "react-github-btn";
import Button from "../lib/button";

export default function Hero() {
  return (
    <div className="hero min-h-700 py-32 p-4 text-center">
      <h1 className="text-5xl font-medium mb-4">No-nonsense video calls.</h1>
      <h3 className="text-2xl mb-16">No logins. No tracking. Free forever.</h3>
      <div className="flex flex-row space-x-2 mb-16 justify-center">
        <input
          type="text"
          placeholder="e.g. engineering standup"
          className="rounded p-2 text-black w-56"
        />
        <Button text="Create room" icon={<PlusCircleIcon width={24} />} />
      </div>
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
