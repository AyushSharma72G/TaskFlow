import { Search } from "lucide-react";

interface ProjectsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
}

export default function ProjectsSearchBar({
  value,
  onChange,
  onSearch,
  className,
}: ProjectsSearchBarProps) {
  return (
    <label className={`relative min-w-0 ${className ?? "flex-1"}`}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          onSearch();
        }}
        placeholder="Search projects by title or description..."
        className="w-full rounded-[var(--radius-lg)] border border-transparent bg-[var(--color-surface)] px-4 py-2.5 pr-28 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:ring-2 focus:ring-[var(--color-primary)]/10"
      />
      <button
        type="button"
        onClick={onSearch}
        className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary)]/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
      >
        <Search className="h-3.5 w-3.5" />
        Search
      </button>
    </label>
  );
}
