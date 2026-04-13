import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Layers, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { AppDispatch } from "../../../store/index";
import { setProjectFilter } from "../store/activitySlice";
import { fetchActivityLogs } from "../store/activityThunk";
import { selectSelectedProjectId } from "../store/activitySelectors";
import { selectProjects } from "../../projects/store/projectsSelectors";
import { fetchProjects } from "../../projects/store/projectsThunks";

const ActivityLogFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const projects = useSelector(selectProjects);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [projects.length, dispatch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (projectId: string | null) => {
    dispatch(setProjectFilter(projectId));
    dispatch(fetchActivityLogs({ projectId: projectId ?? undefined }));
    setOpen(false);
  };

  const selectedLabel =
    projects?.find((p) => String(p.id) === String(selectedProjectId))?.title ?? "All Projects";

  const options = [
    { id: null, title: "All Projects" },
    ...(projects ?? []).map((p) => ({ id: p.id, title: p.title })),
  ];

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block", minWidth: 220 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "7px 12px",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          background: "var(--color-surface)",
          border: `1px solid ${open ? "var(--color-primary)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-sm)",
          boxShadow: open
            ? "0 0 0 3px rgb(37 99 235 / 0.1)"
            : "var(--shadow-sm)",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          userSelect: "none",
        }}
      >
        <Layers size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--color-text-muted)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Filter by project"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "100%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md, 0 4px 16px rgb(0 0 0 / 0.1))",
            zIndex: 50,
            padding: "4px 0",
            margin: 0,
            listStyle: "none",
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const isSelected = String(opt.id) === String(selectedProjectId) ||
              (opt.id === null && selectedProjectId === null);
            return (
              <li
                key={opt.id ?? "__all__"}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.id as string | null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "8px 12px",
                  fontSize: "0.8125rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)",
                  background: isSelected ? "rgb(239 246 255)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.1s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background = "var(--color-muted, rgb(248 250 252))";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background = "var(--color-muted)";
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt.title}</span>
                {isSelected && <Check size={13} style={{ flexShrink: 0, color: "var(--color-primary)" }} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogFilter;