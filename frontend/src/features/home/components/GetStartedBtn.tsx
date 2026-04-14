import { useNavigate } from "react-router-dom";

const GetStartedBtn = ()=>{

    const navigate = useNavigate();

    return(
        <div onClick={()=>navigate('/auth')}
            className="cursor-pointer font-[var(--font-weight-subheading)] w-[150px] rounded-md h-[50px]
            transition duation-300 ease-in-out hover:scale-110 hover:shadow-[var(--shadow-lg)] hover:bg-[var(--color-secondary)]
            text-white bg-[var(--color-primary-dark)] text-[var(--text-heading)] text-center md:p-3">

            Get Started
        </div>
        
    )
}

export default GetStartedBtn;