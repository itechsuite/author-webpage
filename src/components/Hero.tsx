"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AuthorPortrait from "./AuthorPortrait";

const bioHighlight =
  "Telling stories is the oldest art form in human history, and to date, it has not lost its ability to entertain, inspire, and expand our imagination.";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";

  return (
    <section className="section grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
      <motion.div
        className="order-2 flex flex-col md:order-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={item}
          className="font-display text-5xl font-medium tracking-wide text-noir md:text-6xl"
        >
          {name}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-md font-serif text-xl italic leading-relaxed text-noir/80"
        >
          {bioHighlight}
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <Link href="/about" className="btn-outline">
            Read More
          </Link>
        </motion.div>
      </motion.div>

      <AuthorPortrait
        src="https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783127504737-main-author.jpeg"
        alt={`Portrait of ${name}`}
        priority
        className="order-1 mx-auto w-full max-w-sm md:order-2 md:mx-0 md:max-w-none"
      />
    </section>
  );
}
