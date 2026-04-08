type TabKey = "login" | "register";

type AuthTabsProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function AuthTabs({ activeTab, onChange }: AuthTabsProps) {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
          activeTab === "login"
            ? "bg-surface text-primary shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => onChange("register")}
        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
          activeTab === "register"
            ? "bg-surface text-primary shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Register
      </button>
    </div>
  );
}
