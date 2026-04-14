
import Welcome from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import ProjectBar from "../components/ProjectBar";
import RecentActivity from "../components/RecentActivity";

const DashboardPage = ()=>{
    
    return(
        <div  className="bg-[var(--color-bg)] pt-3">
           <Welcome/>
           <ProgressBar/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectBar/> 
           <RecentActivity/>
           </div>
        </div>
    )
}

export default DashboardPage;