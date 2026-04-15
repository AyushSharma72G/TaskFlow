import { useMemo, useState } from "react";
import AuthSubmitButton from "./AuthSubmitButton";
import {
  getRegisterValidationMessage,
  trimAuthInput,
} from "./authFormValidation";
import FormValidationMessage from "./FormValidationMessage";
import PasswordInput from "./PasswordInput";

type RegisterFormProps = {
  loading?: boolean;
  onSubmit: (payload: {
    name: string;
    email: string;
    password: string;
  }) => void;
};

export default function RegisterForm({
  loading = false,
  onSubmit,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const { name: trimmedName, email: trimmedEmail, password: trimmedPassword } =
    trimAuthInput({ name, email, password });

  const isValid = useMemo(
    () =>
      getRegisterValidationMessage({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      }) === null,
    [trimmedName, trimmedEmail, trimmedPassword],
  );

  const validationMessage = useMemo(
    () =>
      getRegisterValidationMessage({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    [trimmedName, trimmedEmail, trimmedPassword],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    if (!isValid || loading) return;

    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormValidationMessage
        message={hasTriedSubmit ? validationMessage : null}
        variant="error"
      />

      <div className="space-y-1.5">
        <label
          htmlFor="register-name"
          className="text-sm font-medium text-text-secondary"
        >
          Full Name
          <span className="text-danger">*</span>
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
        <label
          htmlFor="register-email"
          className="text-sm font-medium text-text-secondary"
        >
          Email
          <span className="text-danger">*</span>
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

      <AuthSubmitButton
        label="Create account"
        loading={loading}
        disabled={loading}
      />
    </form>
  );
}
