export function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return <>{text}</>;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded-sm bg-[var(--color-primary)]/20 px-0.5 font-medium text-[var(--color-primary)] transition-colors"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
