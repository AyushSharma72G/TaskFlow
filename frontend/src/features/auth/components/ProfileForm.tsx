import { useEffect, useMemo, useRef, useState } from "react";
import type { AuthUser } from "../types";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileFormProps = {
  user: AuthUser;
  isSaving?: boolean;
  isUploadingAvatar?: boolean;
  isRemovingAvatar?: boolean;
  onSaveProfile: (payload: { name?: string }) => Promise<void>;
  onUploadAvatar: (avatar: File) => Promise<void>;
  onRemoveAvatar: () => Promise<void>;
};

export default function ProfileForm({
  user,
  isSaving = false,
  isUploadingAvatar = false,
  isRemovingAvatar = false,
  onSaveProfile,
  onUploadAvatar,
  onRemoveAvatar,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user.name ?? "");
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [selectedAvatarPreview, setSelectedAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name ?? "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (selectedAvatarPreview) {
        URL.revokeObjectURL(selectedAvatarPreview);
      }
    };
  }, [selectedAvatarPreview]);

  const normalizedInitialName = (user.name ?? "").trim();
  const normalizedCurrentName = name.trim();

  const hasProfileChanges = useMemo(() => {
    return normalizedCurrentName.length > 0 && normalizedCurrentName !== normalizedInitialName;
  }, [normalizedCurrentName, normalizedInitialName]);

  const activeAvatarUrl = selectedAvatarPreview ?? user.avatarUrl ?? "";
  const canUploadAvatar = Boolean(selectedAvatarFile) && !isUploadingAvatar;
  const hasPersistedAvatar = !selectedAvatarFile && (Boolean(user.avatarUrl) || isRemovingAvatar);
  const canRemoveAvatar = Boolean(user.avatarUrl) && !selectedAvatarFile && !isRemovingAvatar;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasProfileChanges || isSaving) {
      return;
    }

    setLocalError(null);

    await onSaveProfile({ name: normalizedCurrentName });
  };

  const handleSelectAvatarFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    event.currentTarget.value = "";

    if (!nextFile) {
      return;
    }

    if (!ALLOWED_AVATAR_MIME_TYPES.includes(nextFile.type)) {
      setLocalError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (nextFile.size > MAX_AVATAR_SIZE_BYTES) {
      setLocalError("Avatar size should be under 5 MB.");
      return;
    }

    setLocalError(null);
    if (selectedAvatarPreview) {
      URL.revokeObjectURL(selectedAvatarPreview);
    }

    setSelectedAvatarFile(nextFile);
    setSelectedAvatarPreview(URL.createObjectURL(nextFile));
  };

  const handleUploadAvatar = async () => {
    if (!selectedAvatarFile || isUploadingAvatar) {
      return;
    }

    setLocalError(null);
    await onUploadAvatar(selectedAvatarFile);

    if (selectedAvatarPreview) {
      URL.revokeObjectURL(selectedAvatarPreview);
    }

    setSelectedAvatarFile(null);
    setSelectedAvatarPreview(null);
  };

  const handleCancelAvatarSelection = () => {
    if (selectedAvatarPreview) {
      URL.revokeObjectURL(selectedAvatarPreview);
    }

    setSelectedAvatarFile(null);
    setSelectedAvatarPreview(null);
    setLocalError(null);
  };

  const handleRemoveAvatar = async () => {
    if (!canRemoveAvatar) {
      return;
    }

    setLocalError(null);
    await onRemoveAvatar();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {localError ? (
        <div className="rounded-md border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">
          {localError}
        </div>
      ) : null}

      <section className="rounded-xl border border-border bg-surface-hover p-4">
        <p className="text-sm font-semibold text-text-primary">Avatar</p>
        <p className="mt-1 text-sm text-text-secondary">
          Use a clear square image. JPG, PNG, or WEBP up to 5 MB.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
            {activeAvatarUrl ? (
              <img src={activeAvatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-text-secondary">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleSelectAvatarFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-sm transition hover:bg-muted"
            >
              {selectedAvatarFile ? "Choose another" : "Upload avatar"}
            </button>

            <button
              type="button"
              onClick={handleUploadAvatar}
              disabled={!canUploadAvatar}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingAvatar ? "Uploading..." : "Save avatar"}
            </button>

            {selectedAvatarFile ? (
              <button
                type="button"
                onClick={handleCancelAvatarSelection}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-text-secondary transition hover:bg-muted"
              >
                Cancel
              </button>
            ) : null}

            {hasPersistedAvatar ? (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isRemovingAvatar}
                className="inline-flex h-10 items-center justify-center rounded-md border border-danger/30 bg-danger/10 px-4 text-sm font-medium text-danger transition hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRemovingAvatar ? "Removing..." : "Remove avatar"}
              </button>
            ) : null}
          </div>
        </div>

        {selectedAvatarFile ? (
          <p className="mt-3 text-xs text-text-secondary">Selected: {selectedAvatarFile.name}</p>
        ) : null}
      </section>

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
        <label htmlFor="profile-email" className="text-sm font-medium text-text-secondary">
          Email Address
        </label>
        <input
          id="profile-email"
          value={user.email}
          disabled
          className="h-11 w-full rounded-md border border-border bg-muted px-3 text-sm text-text-secondary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving || !hasProfileChanges}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 font-semibold text-text-inverse shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Saving..." : "Save profile changes"}
      </button>
    </form>
  );
}
