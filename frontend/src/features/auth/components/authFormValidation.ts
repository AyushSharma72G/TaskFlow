const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FULL_NAME_PATTERN = /^[A-Za-z ]+$/;

type EmailPasswordInput = {
  email: string;
  password: string;
};

type RegisterInput = EmailPasswordInput & {
  name: string;
};

export const trimAuthInput = <T extends Record<string, string>>(payload: T): T => {
  const trimmedEntries = Object.entries(payload).map(([key, value]) => [
    key,
    value.trim(),
  ]);

  return Object.fromEntries(trimmedEntries) as T;
};

export const getLoginValidationMessage = ({
  email,
  password,
}: EmailPasswordInput): string | null => {
  if (!email) return "Email is required.";
  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email (example: you@example.com).";
  }
  if (!password) return "Password is required.";
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.at(0) === " " || password.at(-1) === " ") {
    return "Password cannot start or end with a space.";
  }
  if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])/.test(password)) {
    return "Password should contain at least one letter, one number and special character.";
  }
  return null;
};

export const getRegisterValidationMessage = ({
  name,
  email,
  password,
}: RegisterInput): string | null => {
  if (!name) return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (!FULL_NAME_PATTERN.test(name)) {
    return "Name can only contain letters and spaces (no numbers or special characters).";
  }

  const loginValidationMessage = getLoginValidationMessage({ email, password });
  if (loginValidationMessage) {
    return loginValidationMessage;
  }

  return null;
};