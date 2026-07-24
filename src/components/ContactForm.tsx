"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    setSending(false);

    if (!res.ok) {
      setError("Something went wrong sending your message — please try again.");
      return;
    }

    setSent(true);
  }

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
        />
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
      />
      <textarea
        required
        rows={6}
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none border-b border-noir/30 bg-transparent px-2 py-3 font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none"
      />
      {error && <p className="font-serif text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={sending} className="btn-accent self-start disabled:opacity-50">
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
