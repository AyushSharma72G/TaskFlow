import Features from "../components/Features";
import homePageImg from '../../../../public/images/homePageImg.svg'
import { TiTick } from "react-icons/ti";
import GetStartedBtn from "../components/GetStartedBtn";

const HomePage = ()=>{
    return(
        <div className="bg-[var(--color-bg)]">

            <div className="flex justify-between">
                <div className="flex flex-row justify-center gap-4">
                <div className="pt-3"><TiTick color="#ffffff" size={50} style={{background:'var(--color-primary-dark)',borderRadius:'var(--radius-md)'}}/></div>
                <div className="flex flex-col">
                <p className="text-[length:var(--text-heading)] font-[var(--font-weight-heading)]">
                    TaskFlow
                </p>
                <h4 className="text-[length:var(--text-subheading)] font-[var(--font-weight-subheading)] ">
                    Collaborate Organize Achieve
                </h4>

                <p className="text-[length:var(--text-description)] font-[var(--font-weight-description)] pt-2">
                The all-in-one collabrative task and project management platform for
                modern teams - with the power of AI.
                </p>

                </div>
                </div>

             <GetStartedBtn/>
            </div>


              <div className="flex justify-center items-center py-4">
  <img 
    src={homePageImg}
    className="w-full max-w-xs sm:max-w-md md:max-w-md h-auto object-contain"
  />
</div>
            
            <Features/>
            
        </div>
    )
}

export default HomePage;