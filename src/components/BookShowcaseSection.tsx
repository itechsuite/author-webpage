"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Book } from "@/types/book";
import { formatPrice } from "@/lib/format";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const coverReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function BookShowcaseSection({ book, index }: { book: Book; index: number }) {
  const backdrop = book.fullBookCoverUrl || book.coverImageUrl;
  const panelBg = index % 2 === 0 ? "bg-noir" : "bg-[#2b2118]";
  const viewport = { once: false, amount: 0.35 };

  return (
    <section
      className={`relative flex min-h-[100dvh] items-center overflow-hidden ${panelBg} md:min-h-screen`}
    >
      {/* Blurred full-cover backdrop */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={backdrop}
          alt=""
          fill
          className="scale-110 object-cover opacity-70 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/55 via-noir/40 to-noir/70" />
      </div>

      {book.genre && (
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="absolute right-6 top-6 z-10 rounded-full bg-gradient-to-r from-accent to-pink px-4 py-1.5 font-display text-xs uppercase tracking-[0.2em] text-white shadow-sm md:right-10 md:top-10"
        >
          {book.genre}
        </motion.span>
      )}

      <div className="section relative z-10 grid w-full grid-cols-1 items-center gap-10 py-20 sm:gap-12 md:grid-cols-[0.8fr_1fr] md:gap-16 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={coverReveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Link
            href={`/books/${book.slug}`}
            className="group relative mx-auto block aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10 sm:max-w-xs md:mx-0"
          >
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15, staggerChildren: 0.08 }}
          variants={fadeUp}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl uppercase leading-tight tracking-wide text-white sm:text-4xl md:text-6xl"
          >
            {book.title}
          </motion.h2>
          {book.subtitle && (
            <motion.p
              variants={fadeUp}
              className="mt-3 font-serif text-base italic text-cream-50/70 sm:text-lg"
            >
              {book.subtitle}
            </motion.p>
          )}
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl font-serif text-sm leading-relaxed text-cream-50/80 sm:mt-6 sm:text-base md:text-lg"
          >
            {book.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link href={`/books/${book.slug}`} className="btn-accent">
              Book Page
            </Link>
            <span className="font-serif text-base text-cream-50/70 sm:text-lg">
              {formatPrice(book.price, book.currency)}
            </span>
          </motion.div>

          {book.externalSources && book.externalSources.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8">
              <p className="font-serif text-xs uppercase tracking-[0.2em] text-cream-50/50">
                Also Available On
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {book.externalSources.map((s) => (
                  <a
                    key={s.source}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 px-4 py-1.5 font-serif text-sm text-cream-50/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    {s.source}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
