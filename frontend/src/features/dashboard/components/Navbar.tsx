import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectAuthUser } from "../../auth/store/authSelectors";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";

const Welcome = () => {
  const navigate = useNavigate();
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
