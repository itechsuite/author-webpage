export default function NewsletterSignup() {
  return (
    <section id="newsletter" className="bg-accent">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink-900 md:text-4xl">
            5 Minutes Each Week That Might Change Your Life
          </h2>
          <p className="mt-6 font-serif text-lg leading-relaxed text-ink-900/80">
            Enter your email below to sign up for my free newsletter. Each week
            you&apos;ll receive a few ideas, book updates, and the occasional
            uncomfortable truth. No fluff, no filler, no BS — just five minutes
            that might change your life.
          </p>

          <form className="mt-8 flex w-full max-w-lg items-stretch overflow-hidden rounded-full bg-white p-1.5 shadow-sm">
            <input
              type="email"
              required
              placeholder="Your Email Address"
              className="flex-1 bg-transparent px-5 font-serif text-sm text-ink-900 placeholder:text-ink-900/50 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink-900 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-cream-50 transition-colors hover:bg-ink-950"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 font-serif text-sm italic text-ink-900/70">
            Your information is protected and I never spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
}
