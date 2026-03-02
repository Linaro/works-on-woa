import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = true,
  glass = false,
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "rounded-[12px] border border-[var(--color-border)] p-8 transition-shadow duration-300",
        glass
          ? "bg-[rgba(255,255,255,0.04)] backdrop-blur-[10px]"
          : "bg-[var(--color-bg-surface)]",
        hover && "cursor-pointer hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
      style={
        glass
          ? {
              backgroundImage:
                "radial-gradient(ellipse at top, rgba(80, 230, 255, 0.06) 0%, transparent 60%)",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
