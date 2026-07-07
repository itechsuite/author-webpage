import clsx from "clsx";

const TONE_STYLES: Record<string, string> = {
  accent: "bg-adminAccent/15 text-adminAccent-soft",
  success: "bg-emerald-400/15 text-emerald-400",
  danger: "bg-red-400/15 text-red-400",
  neutral: "bg-white/10 text-white/60",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "accent" | "success" | "danger" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-1 font-adminSans text-xs font-semibold capitalize",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
