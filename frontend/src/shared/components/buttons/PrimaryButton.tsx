import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function PrimaryButton({
  children,
  icon,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 cursor-pointer
        rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2.5
         font-medium text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] 
         transition-all duration-200 hover:bg-[var(--color-primary-dark)] 
         disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
