import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex  flex-col h-[100dvh] sm:flex-row bg-bg">
      {/* Desktop: sidebar stays fixed; does not scroll with main */}
      <Sidebar className="fixed inset-y-0 left-0 z-30 hidden h-full w-64 overflow-y-auto md:flex" />

      <header className="z-20 flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-3 shadow-sm md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary transition hover:bg-muted"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <img
            src="/taskflow-logo.png"
            alt="TaskFlow logo"
            className="h-7 w-7 object-contain"
          />
          <p className="text-base leading-none font-semibold tracking-tight text-text-primary">
            TaskFlow
          </p>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div
          className="fixed inset-0 z-40 bg-text-primary/35 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 h-[100dvh] transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          className="h-full"
          onNavigate={() => setIsMobileMenuOpen(false)}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main column: offset for sidebar on desktop; only this region scrolls */}
      <div className="flex min-h-0 flex-1 flex-col ">
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
