import { useState } from "react";
import PasswordInput from "./PasswordInput";

type ChangePasswordFormProps = {
  loading?: boolean;
  onSubmit: (payload: { oldPassword: string; newPassword: string }) => Promise<void>;
};

export default function ChangePasswordForm({
  loading = false,
  onSubmit,
}: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (oldPassword.trim().length < 8 || newPassword.trim().length < 8) {
      setValidationError("Passwords must have at least 8 characters.");
      return;
    }

    if (oldPassword === newPassword) {
      setValidationError("New password must be different from old password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("New password and confirm password must match.");
      return;
    }

    await onSubmit({
      oldPassword: oldPassword.trim(),
      newPassword: newPassword.trim(),
    });

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError ? (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-text-primary">
          {validationError}
        </div>
      ) : null}

      <PasswordInput
        id="current-password"
        name="oldPassword"
        label="Current Password"
        value={oldPassword}
        onChange={setOldPassword}
        placeholder="Current password"
      />

      <PasswordInput
        id="new-password"
        name="newPassword"
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        placeholder="New password"
      />

      <PasswordInput
        id="confirm-new-password"
        name="confirmNewPassword"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirm new password"
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 font-semibold text-text-inverse shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
