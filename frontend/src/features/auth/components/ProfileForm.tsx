import { useEffect, useState } from "react";
import type { AuthUser } from "../types";

type ProfileFormProps = {
  user: AuthUser;
  loading?: boolean;
  onSubmit: (payload: { name?: string; avatarUrl?: string }) => Promise<void>;
};

export default function ProfileForm({
  user,
  loading = false,
  onSubmit,
}: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name ?? "");
    setAvatarUrl(user.avatarUrl ?? "");
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    const payload: { name?: string; avatarUrl?: string } = {};
    if (name.trim() && name.trim() !== user.name) {
      payload.name = name.trim();
    }
    if (avatarUrl.trim() && avatarUrl.trim() !== (user.avatarUrl ?? "")) {
      payload.avatarUrl = avatarUrl.trim();
    }

    if (Object.keys(payload).length === 0) {
      setLocalError("Update at least one profile field before saving.");
      return;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {localError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-text-primary">
          {localError}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="profile-name" className="text-sm font-medium text-text-secondary">
          Full Name
        </label>
        <input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary"
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="profile-avatar" className="text-sm font-medium text-text-secondary">
          Avatar URL
        </label>
        <input
          id="profile-avatar"
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 font-semibold text-text-inverse shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
