type FormValidationMessageProps = {
  message: string | null;
  variant?: "error" | "info";
  className?: string;
};

const variantClasses: Record<"error" | "info", string> = {
  error: "form-validation-message-error",
  info: "form-validation-message-info",
};

export default function FormValidationMessage({
  message,
  variant = "error",
  className = "",
}: FormValidationMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`form-validation-message ${variantClasses[variant]} ${className}`}
    >
      {message}
    </p>
  );
}
