import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectAuthUser } from "../../auth/store/authSelectors";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";


const Welcome = ()=>{

    const navigate = useNavigate()
    const user = useAppSelector(selectAuthUser);
    console.log(user);

    const profileName = user?.name || 'Learner';

    return(
        <div className="flex justify-between ">
        <div>
            <h1 className="font-[var(--font-weight-heading)] text-xl">
            Welcome back, {profileName}!👋 
            </h1>
           <p className="text-[length:var(--text-description)] font-[var(--font-weight-description)]">
            Here's what's happening with your projects today.
            </p>
        </div>
           <div>
            <PrimaryButton onClick={()=>navigate('/projects')}  icon={<GoPlus />}>
            New Project
          </PrimaryButton>
           </div>
        </div>
    )
}

export default Welcome;