import React from "react";
import { cn } from "@/lib/utils";

export const InteractiveHoverButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "px-4 py-2.5 bg-zinc-100 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-300 transition-colors",
        className
      )}
    >
      {text}
    </button>
  );
};


