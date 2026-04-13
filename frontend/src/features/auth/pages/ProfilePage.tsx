import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectBootstrapStatus,
  selectAuthUser,
} from "../store/authSelectors";
import { clearAuthError } from "../store/authSlice";
import {
  changePasswordThunk,
  removeAvatarThunk,
  updateProfileThunk,
  uploadAvatarThunk,
} from "../store/authThunks";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import Loader from "../../../shared/components/Loader";

type FeedbackState = {
  tone: "success" | "error" | "info";
  message: string;
};

const FEEDBACK_TONE_STYLES: Record<FeedbackState["tone"], string> = {
  success: "border-success/35 bg-success/10 text-text-primary",
  error: "border-danger/35 bg-danger/10 text-danger",
  info: "border-border bg-muted text-text-primary",
};

const formatDateLabel = (value?: string): string => {
  if (!value) {
    return "Unavailable";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Unavailable";
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const bootstrapStatus = useAppSelector(selectBootstrapStatus);

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isBootstrapping = bootstrapStatus === "loading";

  const avatar = useMemo(() => {
    return (
      user?.avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
    );
  }, [user?.avatarUrl]);

  const username = useMemo(() => {
    if (!user?.email) {
      return "@user";
    }

    const [localPart] = user.email.split("@");
    const sanitized = localPart?.replace(/[^a-zA-Z0-9._-]/g, "");

    return sanitized ? `@${sanitized.toLowerCase()}` : "@user";
  }, [user?.email]);

  const clearMessages = () => {
    setFeedback(null);
    dispatch(clearAuthError());
  };

  const parseThunkError = (result: { payload?: unknown }) => {
    const payload = result.payload;
    return typeof payload === "string" && payload.trim()
      ? payload
      : "Something went wrong. Please try again.";
  };

  if (isBootstrapping) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
        <p className="mt-2 text-sm text-text-secondary">Unable to load account details right now.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (payload: { name?: string }) => {
    clearMessages();

    setIsSavingProfile(true);
    const result = await dispatch(updateProfileThunk(payload));
    setIsSavingProfile(false);

    if (updateProfileThunk.fulfilled.match(result)) {
      setFeedback({ tone: "success", message: "Profile details updated." });
      return;
    }

    setFeedback({ tone: "error", message: parseThunkError(result) });
  };

  const handleAvatarUpload = async (avatarFile: File) => {
    clearMessages();

    setIsUploadingAvatar(true);
    const result = await dispatch(uploadAvatarThunk({ avatar: avatarFile }));
    setIsUploadingAvatar(false);

    if (uploadAvatarThunk.fulfilled.match(result)) {
      setFeedback({ tone: "success", message: "Avatar updated." });
      return;
    }

    setFeedback({ tone: "error", message: parseThunkError(result) });
  };

  const handleAvatarRemove = async () => {
    clearMessages();

    setIsRemovingAvatar(true);
    const result = await dispatch(removeAvatarThunk());
    setIsRemovingAvatar(false);

    if (removeAvatarThunk.fulfilled.match(result)) {
      setFeedback({ tone: "info", message: "Avatar removed." });
      return;
    }

    setFeedback({ tone: "error", message: parseThunkError(result) });
  };

  const handleChangePassword = async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    clearMessages();

    setIsChangingPassword(true);
    const result = await dispatch(changePasswordThunk(payload));
    setIsChangingPassword(false);

    if (changePasswordThunk.fulfilled.match(result)) {
      setFeedback({ tone: "success", message: "Password changed successfully." });
      return;
    }

    setFeedback({ tone: "error", message: parseThunkError(result) });
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface-hover px-4 py-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Username</p>
              <p className="mt-1 font-semibold text-text-primary">{username}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Member Since</p>
              <p className="mt-1 font-semibold text-text-primary">{formatDateLabel(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-5 grid grid-cols-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              clearMessages();
            }}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              activeTab === "profile"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              clearMessages();
            }}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              activeTab === "password"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Change Password
          </button>
        </div>

        {feedback ? (
          <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${FEEDBACK_TONE_STYLES[feedback.tone]}`}>
            {feedback.message}
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <ProfileForm
            user={user}
            isSaving={isSavingProfile}
            isUploadingAvatar={isUploadingAvatar}
            isRemovingAvatar={isRemovingAvatar}
            onSaveProfile={handleUpdateProfile}
            onUploadAvatar={handleAvatarUpload}
            onRemoveAvatar={handleAvatarRemove}
          />
        ) : (
          <ChangePasswordForm loading={isChangingPassword} onSubmit={handleChangePassword} />
        )}
      </div>
    </div>
  );
}
