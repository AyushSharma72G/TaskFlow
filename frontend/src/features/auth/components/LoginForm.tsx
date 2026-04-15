import { useMemo, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import { getLoginValidationMessage, trimAuthInput } from "./authFormValidation";
import FormValidationMessage from "./FormValidationMessage";
import PasswordInput from "./PasswordInput";

type LoginFormProps = {
  loading?: boolean;
  onSubmit: (payload: { email: string; password: string }) => void;
};

export default function LoginForm({ loading = false, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const { email: trimmedEmail, password: trimmedPassword } = trimAuthInput({
    email,
    password,
  });

  const isValid = useMemo(
    () =>
      getLoginValidationMessage({
        email: trimmedEmail,
        password: trimmedPassword,
      }) === null,
    [trimmedEmail, trimmedPassword],
  );

  const validationMessage = useMemo(
    () =>
      getLoginValidationMessage({
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    [trimmedEmail, trimmedPassword],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    if (!isValid || loading) return;
    onSubmit({ email: trimmedEmail, password: trimmedPassword });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormValidationMessage
        message={hasTriedSubmit ? validationMessage : null}
        variant="error"
      />

      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-text-secondary">
          Email
          <span className="text-danger">
            *
          </span>
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

      <AuthSubmitButton label="Login" loading={loading} disabled={loading} />
    </form>
  );
}
