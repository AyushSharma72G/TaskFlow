import { useAppSelector } from "../../../store/hooks";
import { selectAuthUser } from "../../auth/store/authSelectors";

const Welcome = () => {
  const user = useAppSelector(selectAuthUser);

  const profileName = user?.name || "Learner";

  return (
    <div className="flex justify-between mb-3">
      <div className="flex flex-col gap-2">
        <h1 className="font-[var(--font-weight-heading)] text-xl">
          Welcome back, {profileName}!👋
        </h1>
        <p className="text-[length:var(--text-description)] font-[var(--font-weight-description)]">
          Here's what's happening with your projects today.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
