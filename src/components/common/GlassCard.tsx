import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl",
        "shadow-[0_1px_3px_rgba(30,20,60,0.04),0_10px_30px_-15px_rgba(80,40,180,0.15)]",
        className,
      )}
      {...props}
    />
  );
}
