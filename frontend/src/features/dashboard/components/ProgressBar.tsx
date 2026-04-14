
 import { progressBarConstants } from "../constants/dashboard";

const ProgressBar = ()=>{
    return(
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
  {progressBarConstants.map((progress) => (
    <div className="shadow-[var(--shadow-md)] rounded-sm flex items-center p-3 bg-white gap-3 w-full">
      
      <div className="shrink-0">
        {progress.icon}
      </div>

      <div className="flex flex-col min-w-0">
        <p className="font-[var(--font-weight-heading)] text-[var(--color-text-secondary)]">
          {progress.count}
        </p>
        <p className="font-[var(--font-weight-subheading)] text-[var(--color-text-secondary)] truncate">
          {progress.progress}
        </p>
      </div>

    </div>
  ))}
</div>
    )
}

export default ProgressBar;