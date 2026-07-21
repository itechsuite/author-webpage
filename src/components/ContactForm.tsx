"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: wire this up to an email service (Resend, Formspree, etc.)
    // or a /api/contact route. For now we just acknowledge locally.
    setSent(true);
  }

  // hello 
  if (sent) {
    return (
      <div className="border-l-2 border-accent bg-linen-50 py-10 pl-8 pr-6">
        <p className="font-display text-3xl italic text-accent">Thank you.</p>
        <p className="mt-3 font-serif text-lg leading-relaxed text-noir-muted">
          Your message has been received. I read every note and will get back to
          you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <input
          required
          type="text"
          placeholder="Your name"
          className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          placeholder="Email address"
          className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Subject"
        className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
      />
      <textarea
        required
        rows={6}
        placeholder="Your message"
        className="resize-none border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
      />
      <button type="submit" className="btn-accent self-start">
        Send Message
      </button>
    </form>
  );
}
