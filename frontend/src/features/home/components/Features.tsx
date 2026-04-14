
import { featureConstants } from "../constants/home";

const Features = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {featureConstants.map((feature) => (
        <div
          key={feature.id}
          className="flex items-center gap-3 w-full p-3 bg-white shadow-[var(--shadow-md)] rounded-sm"
        >

          <div className="shrink-0 flex items-center justify-center">
            {feature.icon}
          </div>

          
          <h3 className="font-[var(--font-weight-subheading)] text-[var(--color-text-secondary)] truncate">
            {feature.title}
          </h3>

        </div>
      ))}
    </div>
  );
};

export default Features;