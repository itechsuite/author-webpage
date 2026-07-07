import type { ReactNode } from "react";
import clsx from "clsx";

export default function AdminCard({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-adminBorder bg-adminSurface p-6",
        glow && "shadow-[0_0_40px_-12px_rgba(76,125,255,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}
