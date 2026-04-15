import { useNavigate } from "react-router-dom";
import { CalendarDays, Pencil, Trash2, Users } from "lucide-react";
import { AnimatedTooltip } from "../../../shared/components/AnimatedTooltip";
import type { ProjectListItem } from "../types";

const CARD_DESCRIPTION_PREVIEW_CHARS = 160;

function startOfLocalDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function isPastDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  return startOfLocalDay(d) < startOfLocalDay(new Date());
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  return startOfLocalDay(d).getTime() === startOfLocalDay(new Date()).getTime();
}

export function avatarImageUrl(name: string, avatarUrl: string | null): string {
  return (
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=64`
  );
}

function descriptionPreview(description: string): {
  text: string;
  full: string;
  isEmpty: boolean;
} {
  const full = description?.trim() ?? "";
  if (!full) {
    return {
      text: "No description yet. Edit the project to add details.",
      full: "",
      isEmpty: true,
    };
  }
  if (full.length <= CARD_DESCRIPTION_PREVIEW_CHARS) {
    return { text: full, full, isEmpty: false };
  }
  return {
    text: `${full.slice(0, CARD_DESCRIPTION_PREVIEW_CHARS).trimEnd()}…`,
    full,
    isEmpty: false,
  };
}

type ProjectCardProps = {
  project: ProjectListItem;
  progressPercent: number;
  canManage: boolean;
  onEdit: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
  className?: string;
};

export default function ProjectCard({
  project,
  progressPercent,
  canManage,
  onEdit,
  onDelete,
  className = "",
}: ProjectCardProps) {
  const navigate = useNavigate();
  const {
    text: descText,
    full: descFull,
    isEmpty: descEmpty,
  } = descriptionPreview(project.description);

  const tooltipItems = project.avatars.map((a) => ({
    id: a.id,
    name: a.name,
    designation: "Member",
    image: avatarImageUrl(a.name, a.avatarUrl),
  }));

  const moreThanPreview = Math.max(
    0,
    project.memberCount - project.avatars.length,
  );

  const openProject = () => {
    navigate(`/project/${project.id}`);
  };

  const metaTitle =
    project.memberCount > project.avatars.length && tooltipItems.length > 0
      ? `First ${project.avatars.length} of ${project.memberCount} members shown. Hover avatars for names.`
      : undefined;
  const isPast = isPastDate(project.dueDate);
  const isTodayDate = isToday(project.dueDate);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProject}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProject();
        }
      }}
      className={`group flex w-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-primary)]/[0.04] shadow-[var(--shadow-sm)] outline-none ring-[var(--color-secondary)]/0 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-md)] hover:ring-1 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 ${className}`}
    >
      <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)]" />

      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                canManage
                  ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)]"
                  : "bg-[var(--color-muted)] text-[var(--color-text-secondary)]"
              }`}
            >
              {canManage ? "Project owner" : "Member"}
            </span>
            <h3 className="text-base font-bold leading-snug text-[var(--color-text-primary)] transition group-hover:text-[var(--color-primary)]">
              {project.title}
            </h3>
          </div>

          {canManage ? (
            <div
              className="flex shrink-0 items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label={`Edit ${project.title}`}
                onClick={() => onEdit(project)}
                className="rounded-full p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-primary)]/15 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
              >
                <Pencil size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label={`Delete ${project.title}`}
                onClick={() => onDelete(project)}
                className="rounded-full p-1.5 text-[var(--color-text-muted)] transition hover:bg-red-500/10 hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          ) : null}
        </div>

        <p
          title={descEmpty ? undefined : descFull || undefined}
          className={`mt-2 min-w-0 max-w-full text-sm leading-snug [overflow-wrap:anywhere] line-clamp-2 ${
            descEmpty
              ? "text-[var(--color-text-muted)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          {descText}
        </p>

        <div
          className="mt-3 border-t border-[var(--color-border)] pt-3"
          title={metaTitle}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-[var(--radius-md)] border border-[var(--color-primary)]/15 bg-gradient-to-r from-[var(--color-primary)]/[0.07] via-[var(--color-surface)] to-[var(--color-secondary)]/[0.08] px-2.5 py-2 text-[13px]">
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-text-primary)]">
              <CalendarDays
                size={15}
                className="shrink-0 text-[var(--color-primary)]"
                aria-hidden
              />
              <span className="text-[var(--color-text-muted)]">Start</span>
              <time
                dateTime={project.createdAt}
                className="text-[var(--color-text-secondary)]"
              >
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </span>

            <span
              className="hidden h-4 w-px shrink-0 bg-[var(--color-border-strong)]/80 sm:block"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-text-primary)]">
              <CalendarDays
                size={15}
                className="shrink-0 text-[var(--color-primary)]"
                aria-hidden
              />
              <span className="text-[var(--color-text-muted)]">Due</span>
              <time
                dateTime={project.dueDate}
                className={
                  isPast
                    ? "text-[var(--color-danger)]"
                    : isTodayDate
                      ? "text-yellow-500 font-semibold"
                      : "text-[var(--color-text-secondary)]"
                }
              >
                {new Date(project.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </span>

            <span
              className="hidden h-4 w-px shrink-0 bg-[var(--color-border-strong)]/80 sm:block"
              aria-hidden
            />

            <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary-dark)]">
              <Users
                size={15}
                className="shrink-0 text-[var(--color-secondary)]"
                aria-hidden
              />
              <span className="tabular-nums text-[var(--color-text-primary)]">
                {project.memberCount}
              </span>
              <span className="font-medium text-[var(--color-text-secondary)]">
                {project.memberCount === 1 ? "member" : "members"}
              </span>
            </span>

            {tooltipItems.length > 0 ? (
              <>
                <span
                  className="hidden h-4 w-px shrink-0 bg-[var(--color-border-strong)]/80 sm:block"
                  aria-hidden
                />
                <div
                  className="flex min-w-0 items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <AnimatedTooltip items={tooltipItems} />
                  {moreThanPreview > 0 ? (
                    <span
                      className="shrink-0 rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-[11px] font-bold text-[var(--color-text-secondary)]"
                      title={`${project.avatars.length} avatars shown of ${project.memberCount} members`}
                    >
                      +{moreThanPreview}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <span
                  className="hidden h-4 w-px shrink-0 bg-[var(--color-border-strong)]/80 sm:block"
                  aria-hidden
                />
                <span className="text-xs font-medium text-[var(--color-text-muted)]">
                  Avatars when team grows
                </span>
              </>
            )}
          </div>

          <div className="mt-2.5">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              <span>Progress</span>
              <span className="tabular-nums text-[var(--color-primary)]">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)] ring-1 ring-[var(--color-border)]/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-medium text-[var(--color-text-muted)]">
              {project.completedTasks} / {project.totalTasks} tasks
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
