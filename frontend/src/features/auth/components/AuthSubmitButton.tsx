type AuthSubmitButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function AuthSubmitButton({
  label,
  loading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 font-semibold text-text-inverse shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}
