export default function PageHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-content px-6 pt-20 md:pt-28">
      <h1 className="text-gradient text-6xl leading-none tracking-tight md:text-8xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-noir-muted">
          {intro}
        </p>
      )}
      <hr className="mt-10 border-0 border-t border-noir/20" />
    </div>
  );
}
