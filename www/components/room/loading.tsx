import React from "react";
import Loader from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader type="Oval" color="#EAB308" height={60} width={60} />
    </div>
  );
}
