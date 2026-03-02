import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";

interface BackButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function BackButton({ to, children, className }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "cursor-pointer mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </button>
  );
}
