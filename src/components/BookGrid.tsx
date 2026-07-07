"use client";

import { motion } from "framer-motion";
import type { Book } from "@/types/book";
import BookCard from "./BookCard";

const heading = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const grid = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export default function BookGrid({ books, title }: { books: Book[]; title?: string }) {
  if (books.length === 0) {
    return (
      <div className="section text-center font-serif text-lg italic text-noir-muted">
        No books published yet. Add some from the admin dashboard.
      </div>
    );
  }

  return (
    <section className="section">
      {title && (
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={heading}
          className="text-gradient mb-14 text-center text-4xl uppercase tracking-[0.15em] md:text-5xl"
        >
          {title}
        </motion.h2>
      )}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={grid}
        className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </motion.div>
    </section>
  );
}
