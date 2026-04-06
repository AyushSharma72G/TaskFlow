import { NavLink } from "react-router-dom";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Activity", to: "/activity", icon: ShieldCheck },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
  onClose?: () => void;
};

export const Sidebar = ({ className, onNavigate, onClose }: SidebarProps) => {
  return (
    <aside
      className={`relative flex h-full min-h-0 w-64 flex-col border-r border-border bg-surface p-4 shadow-sm ${className ?? ""}`}
    >
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

      <div className="mb-6 flex items-center gap-2 px-2 py-1">
        <img src="/taskflow-logo.png" alt="TaskFlow logo" className="h-9 w-9 object-contain" />
        <p className="text-[1.7rem] leading-none font-semibold tracking-tight text-text-primary">
          TaskFlow
        </p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-text-inverse shadow-sm"
                  : "text-text-secondary hover:bg-muted hover:text-text-primary"
              }`
            }
          >
            <item.icon className="h-[22px] w-[22px] shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/profile"
        onClick={onNavigate}
        className="mt-auto flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 shadow-sm transition hover:border-border-strong hover:bg-surface-hover"
      >
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">Your Profile</p>
          <p className="truncate text-xs text-text-secondary">Manage account settings</p>
        </div>
      </NavLink>

      <button
        type="button"
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2.5 text-sm font-semibold text-danger shadow-sm transition hover:bg-danger/15 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:ring-offset-2"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
};
