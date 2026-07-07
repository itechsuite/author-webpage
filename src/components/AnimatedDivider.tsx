"use client";

import { motion } from "framer-motion";

export default function AnimatedDivider() {
  return (
    <div className="mx-auto max-w-content px-6">
      <motion.hr
        className="border-0 border-t border-linen-200 origin-center"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
      />
    </div>
  );
}
