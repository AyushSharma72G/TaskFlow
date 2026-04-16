import { useNavigate } from "react-router-dom";
import { House, ArrowLeft } from 'lucide-react';


const NotFoundPage = ()=>{
    const navigate = useNavigate();

    return(
        <div className="flex justify-center align-center">
            <div className="flex flex-col justify-center align-center w-[600px] h-[500px]  bg-[var(--color-surface)]">
            <img src="/images/notFoundPageImg.svg" width={200} className="m-auto"/>
           
           <div className="text-[var(--color-text-secondary)] text-center font-[var(--font-weight-heading)] text-xl ">
             <p>404</p>
            <p>Page Not Found</p>
            <p>The Page you're looking for doesn't exist or has been moved.</p>
           </div>

            <div className="flex justify-around mt-4 mb-2">
                <div onClick={()=>navigate('/')}
                className="cursor-pointer rounded-sm bg-[var(--color-primary)] text-'#ffffff' w-[150px] h-[50px] flex justify-around p-3">
                    <House size={20} color="#ffffff" className="mt-1 font-[var(--font-weight-dexcription)]"/>
                    <p className="text-white font-[var(--font-weight-dexcription)]">
                         Go to Home
                         
                    </p>
                </div>

                <div onClick={()=>navigate(-1)}
                className="cursor-pointer rounded-sm bg-[var(--color-primary)] text-'#ffffff' w-[150px] h-[50px] flex justify-around p-3">
                    <ArrowLeft size={20} color="#ffffff" className="mt-1 font-[var(--font-weight-dexcription)]"/>
                    <p className="text-white font-[var(--font-weight-dexcription)]">
                        Go Back 
                    </p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default NotFoundPage;