"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function NewsletterSignup() {
  return (
    <section id="newsletter" className="border-t border-linen-200">
      <motion.div
        className="section flex flex-col items-center text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={container}
      >
        <motion.h2
          variants={item}
          className="text-gradient text-4xl uppercase tracking-[0.15em] md:text-5xl"
        >
          Join Our Newsletter
        </motion.h2>
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-noir-muted"
        >
          Enter your email below to sign up for my free &quot;You Can&quot;
          Newsletter. It is just a two-minute inspirational note that will
          impact your life.
        </motion.p>

        <motion.form
          variants={item}
          className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 border-b border-noir/30 bg-transparent px-2 py-3 text-center font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none sm:text-left"
          />
          <motion.button
            type="submit"
            className="btn-accent"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Subscribe
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="mt-5 font-serif text-sm italic text-noir-muted">
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </motion.div>
    </section>
  );
}
