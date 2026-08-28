"use client";

import { useEffect } from "react";

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log("error", error.message);
  }, []);
  return (
    <div>
      <h1>About Error</h1>
    </div>
  );
}
