import Link from "next/link";
import AuthorPortrait from "./AuthorPortrait";

const bioHighlight =
  "Telling stories is the oldest art form in human history, and to date, it has not lost its ability to entertain, inspire, and expand our imagination.";

export default function Hero() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || "Your Name";

  return (
    <section className="section grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
      <div className="order-2 flex flex-col md:order-1">
        <h1 className="font-display text-5xl font-medium tracking-wide text-noir md:text-6xl">
          {name}
        </h1>

        <p className="mt-8 max-w-md font-serif text-xl italic leading-relaxed text-noir/80">
          {bioHighlight}
        </p>

        <div className="mt-8">
          <Link href="/about" className="btn-outline">
            Read More
          </Link>
        </div>
      </div>

      <AuthorPortrait
        src="https://pub-2f8f7122da514161b38cdfcd7fecfb26.r2.dev/covers/1783127504737-main-author.jpeg"
        alt={`Portrait of ${name}`}
        priority
        className="order-1 mx-auto w-full max-w-sm md:order-2 md:mx-0 md:max-w-none"
      />
    </section>
  );
}
