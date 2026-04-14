import FallBackUiImg from '../../../public/images/loadingImgForFallbackUi.svg';

const FallBackUIComponent = ({ message = "Please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
      
      <img
        src={FallBackUiImg}
        alt="Loading..."
        className="w-32 h-32 object-contain animate-pulse"
      />

      <p className="text-center text-lg md:text-xl font-[var(--font-weight-heading)] text-[var(--color-text-secondary)]">
        {message}
      </p>

      {/* Optional loader bar */}
      <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary-light)] animate-[loading_1.5s_infinite] w-1/2"></div>
      </div>
    </div>
  );
};

export default FallBackUIComponent;