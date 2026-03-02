import { cn } from "@/utils/cn";
import { MultiSelect } from "./MultiSelect";
import type { MultiSelectOption } from "./MultiSelect";

interface FilterBarProps {
  filters: {
    label: string;
    key: string;
    options: MultiSelectOption[];
  }[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className,
}: FilterBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => v && v.length > 0
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => (
        <MultiSelect
          key={filter.key}
          label={filter.label}
          options={filter.options}
          selected={activeFilters[filter.key] ?? []}
          onChange={(values) => onFilterChange(filter.key, values)}
        />
      ))}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="cursor-pointer text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
