import { Search, X } from "lucide-react";
import { HighlightMatch } from "../../../shared/utils/Highlight";
import type { ProjectListItem } from "../types";
import { useState, useMemo, useRef, useEffect } from "react";

interface ProjectsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (forcedValue?: string) => void;
  suggestions?: ProjectListItem[];
  className?: string;
}

export default function ProjectsSearchBar({
  value,
  onChange,
  onSearch,
  suggestions = [],
  className,
}: ProjectsSearchBarProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleSuggestions = useMemo(() => {
    return suggestions.filter((p) => !dismissedIds.includes(p.id));
  }, [suggestions, dismissedIds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange("");
    onSearch("");
    setDismissedIds([]);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setIsOpen(true);
    if (val === "") {
      setDismissedIds([]);
      onSearch("");
      setIsOpen(false);
    }
  };

  const handleDismissSuggestion = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? "flex-1"}`}>
      <label className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-[var(--color-text-muted)]" />

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
              setIsOpen(false);
            }
          }}
          placeholder="Search projects..."
          className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] shadow-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {isOpen && visibleSuggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
          <div className="bg-[var(--color-background)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Suggested Projects
          </div>

          <div className="max-h-60 overflow-y-auto">
            {visibleSuggestions.map((p) => (
              <div
                key={p.id}
                className="group flex w-full items-center justify-between px-4 py-2 transition-colors hover:bg-[var(--color-primary)]/5"
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(p.title);
                    onSearch(p.title);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left text-sm"
                >
                  <HighlightMatch text={p.title} query={value} />
                </button>

                <button
                  onClick={(e) => handleDismissSuggestion(e, p.id)}
                  className="ml-2 rounded-md p-1 text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-[var(--color-border)]/30 hover:text-[var(--color-text-primary)] group-hover:opacity-100"
                  title="Remove suggestion"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
