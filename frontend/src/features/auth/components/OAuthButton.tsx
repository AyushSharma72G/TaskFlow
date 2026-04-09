type OAuthProviderName = 'google' | 'github';
type OAuthMode = 'login' | 'register';

type OAuthButtonProps = {
  provider: OAuthProviderName;
  mode?: OAuthMode;
};

const labels: Record<OAuthMode, Record<OAuthProviderName, string>> = {
  login: {
    google: 'Continue with Google',
    github: 'Continue with GitHub',
  },
  register: {
    google: 'Register with Google',
    github: 'Register with GitHub',
  },
};

export default function OAuthButton({ provider, mode = 'login' }: OAuthButtonProps) {
  const backend = import.meta.env.VITE_API_BASE_URL;
  const href = `${backend}/auth/${provider}`;

  return (
    <a
      href={href}
      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary transition hover:border-primary hover:text-primary"
    >
      <span>
        {provider === 'google' && (
          <img className="mr-2 h-5 w-5"
          src="/icons/google.png" alt="Google" />
        )}
        {provider === 'github' && (
          <img className="mr-2 h-5 w-5"
          src="/icons/github.png" alt="GitHub" />
        )}
      </span>
      {labels[mode][provider]}
    </a>
  );
}
