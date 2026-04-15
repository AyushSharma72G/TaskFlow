import OAuthButton from "./OAuthButton";

type AuthSocialSectionProps = {
  mode: "login" | "register";
};

export default function AuthSocialSection({ mode }: AuthSocialSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <OAuthButton provider="google" mode={mode} />
        <OAuthButton provider="github" mode={mode} />
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-secondary">or use email</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}