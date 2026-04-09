type OAuthProviderName = 'google' | 'github';

type OAuthButtonProps = {
  provider: OAuthProviderName;
};

const labels: Record<OAuthProviderName, string> = {
  google: 'Continue with Google',
  github: 'Continue with GitHub',
};

export default function OAuthButton({ provider }: OAuthButtonProps) {
  const backend = import.meta.env.VITE_API_BASE_URL;
  const href = `${backend}/auth/${provider}`;

  return (
    <a
      href={href}
      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary transition hover:border-primary hover:text-primary"
    >
      {labels[provider]}
    </a>
  );
}
