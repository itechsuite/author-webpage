"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Book } from "@/types/book";

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -35, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 90, damping: 14, mass: 0.9 },
  },
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <motion.div variants={cardVariants} style={{ perspective: 1000, transformStyle: "preserve-3d" }}>
      <Link href={`/books/${book.slug}`} className="group flex flex-col text-center">
        <motion.div
          className="relative aspect-[2/3] w-full overflow-hidden bg-linen-100 shadow-lg"
          whileHover={{ y: -8, boxShadow: "0 30px 50px -20px rgba(36,30,26,0.4)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src={book.coverImageUrl}
            alt={book.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.05] ${
              book.comingSoon ? "opacity-70 grayscale-[0.3]" : ""
            }`}
          />
          {book.comingSoon && (
            <span className="absolute right-3 top-3 rounded-full bg-noir/90 px-3 py-1 font-display text-xs uppercase tracking-[0.15em] text-white">
              Coming Soon
            </span>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col items-center gap-1 pt-5">
          <h3 className="font-display text-2xl leading-tight text-noir transition-colors group-hover:text-accent">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="font-serif text-sm italic text-noir-muted">{book.subtitle}</p>
          )}
          {book.comingSoon && (
            <span className="mt-2 font-serif text-base italic text-noir-muted">Coming Soon</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
