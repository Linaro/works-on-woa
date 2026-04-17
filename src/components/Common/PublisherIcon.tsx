import { useState } from "react";
import { cn } from "@/utils/cn";

interface PublisherIconProps {
  icon?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 rounded-md text-[10px]",
  sm: "h-8 w-8 rounded-md text-xs",
  md: "h-12 w-12 rounded-2xl text-base",
  lg: "h-14 w-14 rounded-2xl text-2xl",
  xl: "h-16 w-16 rounded-2xl text-2xl",
};

export function PublisherIcon({ icon, name, size = "sm", className }: PublisherIconProps) {
  const [failed, setFailed] = useState(false);

  const sizeClass = sizeClasses[size] ?? sizeClasses.sm;

  if (icon && !failed) {
    return (
      <img
        src={`/icons/publishers/${icon}`}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 object-contain",
          sizeClass,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-[rgba(255,255,255,0.06)] font-bold text-[var(--color-accent)]",
        sizeClass,
        className
      )}
    >
      {name.charAt(0)}
    </div>
  );
}
