import { useRouter } from "next/router";
import React from "react";
import Button from "../components/lib/button";

export default function Goodbye() {
  const router = useRouter();

  const leftUrl = router.query.left as string | undefined;

  const handleRejoin = React.useCallback(() => {
    if (leftUrl !== undefined) {
      router.push(leftUrl);
    }
  }, [leftUrl, router]);

  const handleHome = React.useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="p-4 py-32 text-center">
      <h1 className="mb-8 text-5xl">👋</h1>
      <div className="mb-16 text-3xl text-slate-300">You left the room.</div>
      <div className="flex space-x-4 justify-center">
        {leftUrl !== undefined && (
          <Button color="slate" text="Rejoin" onClick={handleRejoin} />
        )}
        <Button text="Return to home screen" onClick={handleHome} />
      </div>
    </div>
  );
}
