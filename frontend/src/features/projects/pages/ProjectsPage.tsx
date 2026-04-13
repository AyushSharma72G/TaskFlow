import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import Loader from "../../../shared/components/Loader";
import { selectAuthUser } from "../../auth/store/authSelectors";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import type { ProjectFormValues } from "../components/ProjectFormModal";
import DeleteProjectModal from "../components/DeleteProjectModal";
import {
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
} from "../store/projectsSelectors";
import { clearProjectsError } from "../store/projectsSlice";
import type { ProjectListItem } from "../types";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../store/projectsThunks";

function normalizeId(id: string | undefined | null): string {
  return String(id ?? "").trim();
}

function projectProgress(p: ProjectListItem): number {
  if (p.totalTasks <= 0) return 0;
  return Math.round((p.completedTasks / p.totalTasks) * 100);
}

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const projects = useAppSelector(selectProjects);
  const loading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProject, setEditingProject] = useState<ProjectListItem | null>(
    null,
  );
  const [deletingProject, setDeletingProject] =
    useState<ProjectListItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const canManageProject = useCallback(
    (project: ProjectListItem): boolean => {
      const uid = normalizeId(user?.id);
      const oid = normalizeId(project.ownerId);
      return Boolean(uid && oid && uid === oid);
    },
    [user?.id],
  );

  useEffect(() => {
    void dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => dispatch(clearProjectsError()), 6000);
    return () => window.clearTimeout(t);
  }, [error, dispatch]);

  const openCreate = useCallback(() => {
    setFormMode("create");
    setEditingProject(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback(
    (project: ProjectListItem) => {
      if (!canManageProject(project)) return;
      setFormMode("edit");
      setEditingProject(project);
      setFormOpen(true);
    },
    [canManageProject],
  );

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingProject(null);
  }, []);

  const requestDelete = useCallback(
    (project: ProjectListItem) => {
      if (!canManageProject(project)) return;
      setDeletingProject(project);
    },
    [canManageProject],
  );

  const handleFormSubmit = useCallback(
    async (values: ProjectFormValues) => {
      setFormSubmitting(true);
      try {
        if (formMode === "create") {
          await dispatch(
            createProject({
              title: values.title,
              description: values.description || undefined,
              dueDate: values.dueDate,
            }),
          ).unwrap();
        } else if (editingProject) {
          if (!canManageProject(editingProject)) return;
          await dispatch(
            updateProject({
              projectId: editingProject.id,
              payload: {
                title: values.title,
                description: values.description,
                dueDate: values.dueDate,
              },
            }),
          ).unwrap();
        }
        closeForm();
      } catch {
      } finally {
        setFormSubmitting(false);
      }
    },
    [dispatch, formMode, editingProject, closeForm, canManageProject],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingProject || !canManageProject(deletingProject)) return;
    setDeleteSubmitting(true);
    try {
      await dispatch(deleteProject(deletingProject.id)).unwrap();
      setDeletingProject(null);
    } catch {
    } finally {
      setDeleteSubmitting(false);
    }
  }, [dispatch, deletingProject, canManageProject]);

  const cancelDelete = useCallback(() => setDeletingProject(null), []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Projects
          </h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Create, manage, and collaborate on your projects. Only the project
            owner can edit or delete a project.
          </p>
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

      {error ? (
        <div
          className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {projects.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] md:p-10">
          <p className="max-w-md text-left text-[var(--color-text-secondary)]">
            You don't have any projects yet. Create one to get started and begin
            organizing your work.
          </p>
          <PrimaryButton
            type="button"
            className="mt-6"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
          >
            New project
          </PrimaryButton>
        </div>
      ) : (
        <ul className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="w-full">
              <ProjectCard
                className="w-full"
                project={project}
                progressPercent={projectProgress(project)}
                canManage={canManageProject(project)}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <ProjectFormModal
          mode={formMode}
          initialProject={formMode === "edit" ? editingProject : null}
          submitting={formSubmitting}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {deletingProject ? (
        <DeleteProjectModal
          project={deletingProject}
          submitting={deleteSubmitting}
          onCancel={cancelDelete}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
