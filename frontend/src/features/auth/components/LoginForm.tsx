import { useMemo, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";

type LoginFormProps = {
  loading?: boolean;
  onSubmit: (payload: { email: string; password: string }) => void;
};

export default function LoginForm({ loading = false, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = useMemo(
    () => email.trim().includes("@") && password.trim().length >= 8,
    [email, password],
  );

  const validationMessage = useMemo(() => {
    if (!email.trim()) return "Email is required.";
    if (!email.trim().includes("@")) return "Enter a valid email address.";
    if (!password.trim()) return "Password is required.";
    if (password.trim().length < 8) {
      return "Password must be at least 8 characters.";
    }
    return null;
  }, [email, password]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || loading) return;
    onSubmit({ email: email.trim(), password: password.trim() });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary"
          required
        />
      </div>

      <PasswordInput
        id="login-password"
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Minimum 8 characters"
      />

      {validationMessage ? (
        <p className="text-xs text-text-secondary">{validationMessage}</p>
      ) : null}

      <AuthSubmitButton label="Login" loading={loading} disabled={!isValid} />
    </form>
  );
}
