import { Search, X } from "lucide-react";

interface ProjectsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (forcedValue?: string) => void;
  className?: string;
}

export default function ProjectsSearchBar({
  value,
  onChange,
  onSearch,
  className,
}: ProjectsSearchBarProps) {
  const handleClear = () => {
    onChange("");
    onSearch("");
  };

  return (
    <label
      className={`relative flex items-center min-w-0 ${className ?? "flex-1"}`}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (event.target.value === "") onSearch("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSearch();
        }}
        placeholder="Search projects..."
        className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 px-4 pr-32 text-sm text-[var(--color-text-primary)] shadow-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5"
      />

      {value && (
        <div className="absolute right-[88px] flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="h-4 w-[1px] bg-[var(--color-border)]" />
        </div>
      )}

      <button
        type="button"
        onClick={() => onSearch()}
        className="absolute right-1.5 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
      >
        <Search className="h-3.5 w-3.5" />
        Search
      </button>
    </label>
  );
}
