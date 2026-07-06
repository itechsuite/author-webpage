export default function NewsletterSignup() {
  return (
    <section id="newsletter" className="border-t border-linen-200">
      <div className="section flex flex-col items-center text-center">
        <h2 className="text-gradient text-4xl uppercase tracking-[0.15em] md:text-5xl">
          &quot;You Can&quot; Newsletter
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-noir-muted">
          Enter your email below to sign up for my free &quot;You Can&quot;
          Newsletter. It is just a two-minute inspirational note that will
          impact your life.
        </p>

        <form className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 border-b border-noir/30 bg-transparent px-2 py-3 text-center font-serif text-base text-noir placeholder:text-noir-muted focus:border-accent focus:outline-none sm:text-left"
          />
          <button type="submit" className="btn-accent">
            Subscribe
          </button>
        </form>

        <p className="mt-5 font-serif text-sm italic text-noir-muted">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
