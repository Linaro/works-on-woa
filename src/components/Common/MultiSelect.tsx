import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  const isActive = selected.length > 0;

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={isOpen}
        className={cn(
          "cursor-pointer flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]",
          isActive
            ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
            : "border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
        )}
      >
        <span>{label}</span>
        {isActive && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent-primary)] px-1 text-[10px] font-semibold leading-none text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[200px] max-h-[280px] md:max-h-[400px] overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-1 shadow-lg"
          >
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleValue(opt.value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-sm transition-colors",
                    isSelected
                      ? "text-[var(--color-accent-primary)]"
                      : "text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]"
                        : "border-[rgba(255,255,255,0.4)]"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
