import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectAuthError,
  selectAuthStatus,
  selectAuthUser,
} from "../store/authSelectors";
import { clearAuthError } from "../store/authSlice";
import { changePasswordThunk, updateProfileThunk } from "../store/authThunks";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  const avatar = useMemo(() => {
    return (
      user?.avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
    );
  }, [user?.avatarUrl]);

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
        <p className="mt-2 text-sm text-text-secondary">Unable to load user profile.</p>
      </div>
    );
  }

  const clearMessages = () => {
    setSuccessMessage(null);
    dispatch(clearAuthError());
  };

  const handleUpdateProfile = async (payload: {
    name?: string;
    avatarUrl?: string;
  }) => {
    clearMessages();
    const result = await dispatch(updateProfileThunk(payload));
    if (updateProfileThunk.fulfilled.match(result)) {
      setSuccessMessage("Profile updated successfully.");
    }
  };

  const handleChangePassword = async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    clearMessages();
    const result = await dispatch(changePasswordThunk(payload));
    if (changePasswordThunk.fulfilled.match(result)) {
      setSuccessMessage("Password changed successfully.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
            <p className="text-sm text-text-secondary">{user.email}</p>
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
            Update Profile
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

        {successMessage ? (
          <div className="mb-4 rounded-md border border-success/35 bg-success/10 px-3 py-2 text-sm text-text-primary">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-md border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <ProfileForm user={user} loading={isLoading} onSubmit={handleUpdateProfile} />
        ) : (
          <ChangePasswordForm loading={isLoading} onSubmit={handleChangePassword} />
        )}
      </div>
    </div>
  );
}
