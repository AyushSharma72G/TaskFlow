import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import Loader from "../../../shared/components/Loader";
import { selectAuthUser } from "../../auth/store/authSelectors";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import type { ProjectFormValues } from "../components/ProjectFormModal";
import DeleteProjectModal from "../components/DeleteProjectModal";
import ProjectsSearchBar from "../components/ProjectsSearchBar";
import ProjectsFilterMenu from "../components/ProjectsFilterMenu";
import {
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
  selectProjectsLoadingMore,
  selectProjectsNextCursor,
} from "../store/projectsSelectors";
import { clearProjectsError } from "../store/projectsSlice";
import type { ProjectListItem } from "../types";
import type { ProjectDueFilter } from "../types";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../store/projectsThunks";

function normalizeId(id: string | undefined | null): string {
  return String(id ?? "").trim();
}

export function projectProgress(p: ProjectListItem): number {
  if (p.totalTasks <= 0) return 0;
  return Math.round((p.completedTasks / p.totalTasks) * 100);
}

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const projects = useAppSelector(selectProjects);
  const loading = useAppSelector(selectProjectsLoading);
  const loadingMore = useAppSelector(selectProjectsLoadingMore);
  const error = useAppSelector(selectProjectsError);
  const nextCursor = useAppSelector(selectProjectsNextCursor);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProject, setEditingProject] = useState<ProjectListItem | null>(
    null,
  );
  const [deletingProject, setDeletingProject] =
    useState<ProjectListItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedOwnerOnly, setAppliedOwnerOnly] = useState(false);
  const [appliedDueFilter, setAppliedDueFilter] =
    useState<ProjectDueFilter>("all");
  const [draftOwnerOnly, setDraftOwnerOnly] = useState(false);
  const [draftDueFilter, setDraftDueFilter] = useState<ProjectDueFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    (appliedOwnerOnly ? 1 : 0) + (appliedDueFilter !== "all" ? 1 : 0);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    if (searchInput.trim().length < 2) return [];

    return projects
      .filter((p) => p.title.toLowerCase().includes(searchInput.toLowerCase()))
      .slice(0, 5);
  }, [projects, searchInput]);

  useEffect(() => {
    if (searchInput === "") {
      setSearchQuery("");
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(
    () => ({
      limit: 10,
      search: searchQuery || undefined,
      ownerOnly: appliedOwnerOnly,
      dueFilter: appliedDueFilter,
    }),
    [searchQuery, appliedOwnerOnly, appliedDueFilter],
  );

  const canManageProject = useCallback(
    (project: ProjectListItem): boolean => {
      const uid = normalizeId(user?.id);
      const oid = normalizeId(project.ownerId);
      return Boolean(uid && oid && uid === oid);
    },
    [user?.id],
  );

  useEffect(() => {
    void dispatch(fetchProjects(query));
  }, [dispatch, query]);

  const loadMoreProjects = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    await dispatch(
      fetchProjects({ ...query, cursor: nextCursor, append: true }),
    );
  }, [dispatch, nextCursor, loadingMore, query]);

  useEffect(() => {
    if (!loadMoreRef.current || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && nextCursor) {
          void loadMoreProjects();
        }
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreProjects, loadingMore, nextCursor]);

  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => dispatch(clearProjectsError()), 6000);
    return () => window.clearTimeout(t);
  }, [error, dispatch]);

  useEffect(() => {
    if (!filtersOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filtersOpen]);

  const openCreate = () => {
    setFormMode("create");
    setEditingProject(null);
    setFormOpen(true);
  };
  const openEdit = (p: ProjectListItem) => {
    if (!canManageProject(p)) return;
    setFormMode("edit");
    setEditingProject(p);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingProject(null);
  };
  const requestDelete = (p: ProjectListItem) => {
    if (canManageProject(p)) setDeletingProject(p);
  };

  const handleFormSubmit = async (values: ProjectFormValues) => {
    setFormSubmitting(true);
    try {
      if (formMode === "create") {
        await dispatch(createProject({ payload: values, query })).unwrap();
      } else if (editingProject) {
        await dispatch(
          updateProject({
            projectId: editingProject.id,
            payload: values,
            query,
          }),
        ).unwrap();
      }
      closeForm();
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setDeleteSubmitting(true);
    try {
      await dispatch(deleteProject(deletingProject.id)).unwrap();
      setDeletingProject(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const isFiltered = useMemo(() => {
    return searchQuery !== "" || appliedOwnerOnly || appliedDueFilter !== "all";
  }, [searchQuery, appliedOwnerOnly, appliedDueFilter]);

  if (loading && projects.length === 0 && !error) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Projects
          </h1>

          <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            <ProjectsSearchBar
              value={searchInput}
              onChange={setSearchInput}
              suggestions={suggestions}
              onSearch={(forcedValue?: string) => {
                const term =
                  typeof forcedValue === "string" ? forcedValue : searchInput;
                setSearchQuery(term.trim());
              }}
              className="w-full sm:w-[24rem]"
            />

            <div className="relative" ref={filterMenuRef}>
              <ProjectsFilterMenu
                filtersOpen={filtersOpen}
                activeFilterCount={activeFilterCount}
                ownerOnly={draftOwnerOnly}
                dueFilter={draftDueFilter}
                onToggleFilters={() => setFiltersOpen(!filtersOpen)}
                onOwnerOnlyChange={setDraftOwnerOnly}
                onDueFilterChange={setDraftDueFilter}
                onClearAll={() => {
                  setDraftOwnerOnly(false);
                  setDraftDueFilter("all");
                  setAppliedOwnerOnly(false);
                  setAppliedDueFilter("all");
                }}
                onDone={() => {
                  setAppliedOwnerOnly(draftOwnerOnly);
                  setAppliedDueFilter(draftDueFilter);
                  setFiltersOpen(false);
                }}
              />
            </div>

            <PrimaryButton
              type="button"
              onClick={openCreate}
              icon={<Plus className="h-4 w-4" />}
              className="shrink-0"
            >
              New project
            </PrimaryButton>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="relative min-h-[200px]">
        {loading && projects.length > 0 && (
          <div className="absolute -top-2 right-0 z-20 flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-primary)] shadow-sm border border-[var(--color-border)]">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
            Updating results...
          </div>
        )}
        <div
          className={`transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
              {!isFiltered ? (
                <>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[var(--color-primary)]">
                    <FolderPlus size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    No projects created yet
                  </h3>
                  <p className="mt-1 max-w-xs text-[var(--color-text-secondary)]">
                    Get started by creating your first project to organize your
                    tasks.
                  </p>
                  <PrimaryButton
                    type="button"
                    onClick={openCreate}
                    icon={<Plus className="h-4 w-4" />}
                    className="mt-6"
                  >
                    Create Your First Project
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <p className="text-[var(--color-text-secondary)]">
                    No projects match your current filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setAppliedOwnerOnly(false);
                      setAppliedDueFilter("all");
                      setDraftOwnerOnly(false);
                      setDraftDueFilter("all");
                    }}
                    className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
                {projects.map((project) => (
                  <li key={project.id} className="w-full">
                    <ProjectCard
                      project={project}
                      progressPercent={projectProgress(project)}
                      canManage={canManageProject(project)}
                      onEdit={openEdit}
                      onDelete={requestDelete}
                    />
                  </li>
                ))}
              </ul>
              {loadingMore && (
                <div className="p-4 text-center text-xs text-[var(--color-text-muted)]">
                  Loading more...
                </div>
              )}
              <div ref={loadMoreRef} className="h-1 w-full" />
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <ProjectFormModal
          mode={formMode}
          initialProject={editingProject}
          submitting={formSubmitting}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deletingProject && (
        <DeleteProjectModal
          project={deletingProject}
          submitting={deleteSubmitting}
          onCancel={() => setDeletingProject(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
