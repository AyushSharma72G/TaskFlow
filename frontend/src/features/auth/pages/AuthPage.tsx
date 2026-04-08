import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthErrorAlert from "../components/AuthErrorAlert";
import AuthShell from "../components/AuthShell";
import AuthTabs from "../components/AuthTabs";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearAuthError } from "../store/authSlice";
import { selectAuthError, selectAuthStatus } from "../store/authSelectors";
import { loginThunk, registerThunk } from "../store/authThunks";

type AuthTab = "login" | "register";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const loading = status === "loading";

  const onTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    dispatch(clearAuthError());
  };

  const handleLogin = async (payload: { email: string; password: string }) => {
    const result = await dispatch(loginThunk(payload));
    if (loginThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const handleRegister = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    const result = await dispatch(registerThunk(payload));
    if (registerThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <AuthShell>
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-text-primary">
            {activeTab === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-text-secondary">
            {activeTab === "login"
              ? "Login to continue to your workspace."
              : "Register to start organizing your projects."}
          </p>
        </div>

        <AuthTabs activeTab={activeTab} onChange={onTabChange} />

        {error ? <AuthErrorAlert message={error} /> : null}

        {activeTab === "login" ? (
          <LoginForm loading={loading} onSubmit={handleLogin} />
        ) : (
          <RegisterForm loading={loading} onSubmit={handleRegister} />
        )}
      </div>
    </AuthShell>
  );
}
