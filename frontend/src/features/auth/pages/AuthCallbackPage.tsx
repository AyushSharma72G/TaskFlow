import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeOAuthCodeThunk, fetchProfileThunk } from "../store/authThunks";
import { useAppDispatch } from "../../../store/hooks";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      navigate("/auth", { replace: true });
      return;
    }

    window.history.replaceState({}, "", "/auth/callback");

    const runOAuthExchange = async () => {
      try {
        await dispatch(exchangeOAuthCodeThunk(code)).unwrap();
        await dispatch(fetchProfileThunk()).unwrap();
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/auth", { replace: true });
      }
    };

    runOAuthExchange();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4">
      <div className="rounded-lg border border-border bg-surface px-6 py-4 text-sm font-semibold text-text-secondary shadow-sm">
        Completing login...
      </div>
    </div>
  );
}
