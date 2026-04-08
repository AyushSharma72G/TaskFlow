import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.2),transparent_36%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-stretch gap-6 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary to-secondary p-8 text-text-inverse shadow-lg lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold">
              <img src="/taskflow-logo.png" alt="TaskFlow" className="h-5 w-5" />
              TaskFlow
            </div>
            <h1 className="mt-6 text-4xl leading-tight font-bold">
              Collaborate. Organize. Achieve.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/90">
              One workspace for projects, tasks, and team momentum. Sign in to
              continue your workflow.
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold">Manage Projects</p>
            <p className="mt-1 text-sm text-white/85">
              Track work progress and keep your team aligned with one shared view.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-md sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
