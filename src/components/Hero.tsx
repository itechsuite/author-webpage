import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="section flex flex-col items-center gap-12">
      <h1 className="text-center text-4xl font-extrabold tracking-tight text-cream-50 md:text-6xl">
        Hi, I&apos;m <span className="text-accent">Ihuoma Iroaganachi</span>
      </h1>

      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
        <p className="order-2 font-serif text-lg leading-relaxed text-cream-50/90 md:order-1 md:text-xl">
          I write books that cut through the noise — practical, sharp, and
          occasionally uncomfortable. Stories about family, identity, and the
          quiet truths we carry. Some people call them a slow burn. Others say
          they couldn&apos;t put them down. Read on and decide for yourself.
        </p>

        <div className="order-1 mx-auto md:order-2">
          {/* Placeholder headshot — swap /public/author-photo.jpg for the real one */}
          <div className="relative h-56 w-56 overflow-hidden rounded-full ring-4 ring-accent md:h-72 md:w-72">
            <Image
              src="/author-photo.jpg"
              alt="Author portrait"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/books" className="btn-light">
          Browse My Books
        </Link>
        <Link href="/#newsletter" className="btn-outline">
          Join the Newsletter
        </Link>
      </div>
    </section>
  );
}
