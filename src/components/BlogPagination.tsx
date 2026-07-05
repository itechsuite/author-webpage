import Link from "next/link";

export default function BlogPagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mx-auto flex max-w-content justify-center gap-4 px-6 pb-24 font-serif text-sm">
      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="text-accent hover:underline">
          ← Newer
        </Link>
      )}
      <span className="text-noir-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link href={`${basePath}?page=${page + 1}`} className="text-accent hover:underline">
          Older →
        </Link>
      )}
    </div>
  );
}
