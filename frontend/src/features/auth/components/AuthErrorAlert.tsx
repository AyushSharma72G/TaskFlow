type AuthErrorAlertProps = {
  message: string;
};

export default function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
      {message}
    </div>
  );
}
