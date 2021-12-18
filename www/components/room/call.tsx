import React from "react";
import Controls from "./controls";
import Grid from "./grid";

export default function Call() {
  return (
    <div className="w-full h-full flex flex-col p-2 sm:p-4 pb-0 sm:pb-0">
      <Grid />
      <Controls />
    </div>
  );
}
