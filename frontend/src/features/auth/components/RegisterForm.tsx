import { useMemo, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordInput from "./PasswordInput";

type RegisterFormProps = {
  loading?: boolean;
  onSubmit: (payload: { name: string; email: string; password: string }) => void;
};

export default function RegisterForm({
  loading = false,
  onSubmit,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = useMemo(
    () =>
      name.trim().length >= 2 &&
      email.trim().includes("@") &&
      password.trim().length >= 8,
    [name, email, password],
  );

  const validationMessage = useMemo(() => {
    if (!name.trim()) return "Name is required.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!email.trim()) return "Email is required.";
    if (!email.trim().includes("@")) return "Enter a valid email address.";
    if (!password.trim()) return "Password is required.";
    if (password.trim().length < 8) {
      return "Password must be at least 8 characters.";
    }
    return null;
  }, [name, email, password]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || loading) return;

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label htmlFor="register-name" className="text-sm font-medium text-text-secondary">
          Full Name
        </label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="John Doe"
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-email" className="text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary"
          required
        />
      </div>

      <PasswordInput
        id="register-password"
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Minimum 8 characters"
      />

      {validationMessage ? (
        <p className="text-xs text-text-secondary">{validationMessage}</p>
      ) : null}

      <AuthSubmitButton
        label="Create account"
        loading={loading}
        disabled={!isValid}
      />
    </form>
  );
}
