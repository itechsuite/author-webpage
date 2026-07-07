"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function AuthorPortrait({ src, alt, priority, className }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 140, damping: 18, mass: 0.4 });
  const springY = useSpring(mvY, { stiffness: 140, damping: 18, mass: 0.4 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const imageX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const imageY = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const sheenX = useTransform(springX, [-0.5, 0.5], ["20%", "80%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <div className={`relative ${className ?? ""}`} style={{ perspective: 1200 }}>
      {/* Decorative panel — drifts gently behind the portrait, like a held breath */}
      <motion.div
        aria-hidden
        className="absolute -right-4 -top-4 h-full w-full rounded-t-full bg-accent/15 md:-right-6 md:-top-6"
        initial={{ opacity: 0, x: 24, y: -24 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="absolute -right-4 -top-4 h-full w-full rounded-t-full bg-accent/15 md:-right-6 md:-top-6"
          animate={{ y: [0, -14, 0], x: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.div
        ref={frameRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative aspect-[3/4] w-full overflow-hidden rounded-t-full bg-linen-100 shadow-[0_30px_60px_-25px_rgba(36,30,26,0.35)] ring-1 ring-linen-200"
      >
        {/* Slow, continuous "breathing" zoom — makes the portrait feel alive */}
        <motion.div
          className="absolute inset-0"
          style={{ x: imageX, y: imageY }}
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.045, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
        </motion.div>

        {/* Warm light sheen that tracks the cursor, like sunlight catching a photograph */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform(
                sheenX,
                (x) => `radial-gradient(circle at ${x} 30%, rgba(255,255,255,0.55), transparent 55%)`
              ),
            }}
          />
        )}

        {/* Inner edge glow in the accent tone, breathing subtly */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-inset ring-accent/0"
          animate={
            prefersReducedMotion
              ? undefined
              : { boxShadow: [
                  "inset 0 0 0px 0px rgba(181,80,46,0)",
                  "inset 0 0 40px 4px rgba(181,80,46,0.18)",
                  "inset 0 0 0px 0px rgba(181,80,46,0)",
                ] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
