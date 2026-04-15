import { NavLink, matchPath, useLocation } from "react-router-dom";
import {
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectAuthUser } from "../../../features/auth/store/authSelectors";
import { logoutThunk } from "../../../features/auth/store/authThunks";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Activity", to: "/activity", icon: ShieldCheck },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export const Sidebar = ({
  className,
  onNavigate,
  onClose,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) => {
  const isCollapsed = collapsed ?? false;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const profileName = user?.name || "Your Profile";
  const profileEmail = user?.email || "Manage account settings";
  const profileAvatar =
    user?.avatarUrl ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    onNavigate?.();
    navigate("/auth", { replace: true });
  };

  return (
    <aside
      className={`relative flex h-full min-h-0 flex-col border-r border-border bg-surface shadow-sm ${
        isCollapsed ? "w-16 p-2" : "w-64 p-4"
      } ${className ?? ""}`}
    >
      
      {!onClose && onToggleCollapsed && !isCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="absolute right-2 top-4 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md bg-transparent text-text-primary transition hover:bg-muted"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition hover:bg-muted md:hidden"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <div
        className={`mb-6 flex items-center gap-2 px-2 py-1 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {isCollapsed && onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-muted"
            aria-label="Expand sidebar"
          >
            <img
              src="/taskflow-logo.png"
              alt="TaskFlow logo"
              className="h-9 w-9 object-contain"
            />
          </button>
        ) : (
          <img
            src="/taskflow-logo.png"
            alt="TaskFlow logo"
            className="h-9 w-9 object-contain"
          />
        )}
        {!isCollapsed ? (
          <p className="text-[1.7rem] leading-none font-semibold tracking-tight text-text-primary">
            TaskFlow
          </p>
        ) : null}
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) => {
              const isProjectsDeepRoute =
                item.to === "/projects" &&
                Boolean(matchPath({ path: "/project/:id" }, location.pathname));
              const computedActive = isActive || isProjectsDeepRoute;

              return (
              `flex items-center gap-2 rounded-md transition ${
                isCollapsed ? "justify-center px-0 py-2" : "px-3 py-2"
              } ${
                computedActive
                  ? "bg-primary text-text-inverse shadow-sm"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`
              );
            }}
          >
            <item.icon className="h-[22px] w-[22px] shrink-0" />
            {!isCollapsed ? (
              <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/profile"
        onClick={onNavigate}
        className={`mt-auto flex items-center gap-3 rounded-lg border border-border bg-surface shadow-sm transition hover:border-border-strong hover:bg-surface-hover ${
          isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2.5"
        }`}
      >
        <img
          src={profileAvatar}
          alt="Profile"
          className={isCollapsed ? "h-10 w-10 rounded-full object-cover" : "h-10 w-10 rounded-full object-cover"}
        />
        {!isCollapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {profileName}
            </p>
            <p className="truncate text-xs text-text-secondary">
              {profileEmail}
            </p>
          </div>
        ) : null}
      </NavLink>

      <button
        type="button"
        onClick={handleLogout}
        title={isCollapsed ? "Logout" : undefined}
        className={`mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-danger/25 bg-danger/10 text-sm font-semibold text-danger shadow-sm transition hover:bg-danger/15 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:ring-offset-2 ${
          isCollapsed ? "px-2 py-2" : "px-3 py-2.5"
        }`}
      >
        <LogOut className="h-5 w-5" />
        {!isCollapsed ? "Logout" : null}
      </button>
    </aside>
  );
};
