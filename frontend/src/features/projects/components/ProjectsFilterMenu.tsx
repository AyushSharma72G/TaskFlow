import { Filter, X } from "lucide-react";
import type { ProjectDueFilter } from "../types";

interface ProjectsFilterMenuProps {
  filtersOpen: boolean;
  activeFilterCount: number;
  ownerOnly: boolean;
  dueFilter: ProjectDueFilter;
  onToggleFilters: () => void;
  onOwnerOnlyChange: (ownerOnly: boolean) => void;
  onDueFilterChange: (dueFilter: ProjectDueFilter) => void;
  onClearAll: () => void;
  onDone: () => void;
}

export default function ProjectsFilterMenu({
  filtersOpen,
  activeFilterCount,
  ownerOnly,
  dueFilter,
  onToggleFilters,
  onOwnerOnlyChange,
  onDueFilterChange,
  onClearAll,
  onDone,
}: ProjectsFilterMenuProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleFilters}
        aria-expanded={filtersOpen}
        aria-controls="project-filters-panel"
        className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-surface-hover)]"
      >
        <Filter className="h-4 w-4 text-[var(--color-primary)]" />
        Filters
        {activeFilterCount > 0 ? (
          <span className="rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {filtersOpen ? (
        <div
          id="project-filters-panel"
          className="fixed left-auto right-3 top-0 z-30 w-[min(22rem,calc(100vw-1.5rem))] max-h-[85vh] overflow-y-auto rounded-b-[var(--radius-xl)] border border-transparent bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lg)] backdrop-blur-sm sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:max-h-[70vh] sm:w-[22rem] sm:rounded-[var(--radius-xl)]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Filters
              </h3>
              <button
                type="button"
                onClick={onToggleFilters}
                aria-label="Close filters"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]/50 hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Ownership
              </span>
              <div
                className="grid grid-cols-2 gap-2 rounded-[var(--radius-md)] border border-transparent bg-[var(--color-background)]/40 p-1"
                role="radiogroup"
                aria-label="Ownership filter"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={!ownerOnly}
                  onClick={() => onOwnerOnlyChange(false)}
                  className={`rounded-[var(--radius-sm)] px-2.5 py-2 text-xs font-semibold transition ${
                    !ownerOnly
                      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  All projects
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={ownerOnly}
                  onClick={() => onOwnerOnlyChange(true)}
                  className={`rounded-[var(--radius-sm)] px-2.5 py-2 text-xs font-semibold transition ${
                    ownerOnly
                      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  Only my projects
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                Due date
              </span>
              <div
                className="flex flex-wrap gap-2 rounded-[var(--radius-md)] border border-transparent bg-[var(--color-background)]/40 p-2"
                role="radiogroup"
                aria-label="Due date filter"
              >
                {[
                  { value: "all", label: "All dates" },
                  { value: "overdue", label: "Overdue" },
                  { value: "today", label: "Due today" },
                  { value: "this_week", label: "Due this week" },
                  { value: "next_30_days", label: "Next 30 days" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={dueFilter === option.value}
                    onClick={() => onDueFilterChange(option.value as ProjectDueFilter)}
                    className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${
                      dueFilter === option.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-semibold text-[var(--color-primary)] transition hover:text-[var(--color-primary-hover)]"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onDone}
                className="rounded-[var(--radius-md)] border border-transparent !bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold !text-white transition hover:!bg-[var(--color-primary)] hover:brightness-95 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 active:brightness-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
