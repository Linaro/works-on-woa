import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Upload, LayoutGrid } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  className?: string;
  compact?: boolean;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ className, compact, defaultValue, onSearch }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultValue ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        if (onSearch) {
          onSearch(query.trim());
        } else {
          navigate(`/apps?search=${encodeURIComponent(query.trim())}`);
        }
      }
    },
    [query, onSearch, navigate]
  );

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={t("hero.searchPlaceholder")}
        aria-label={t("hero.searchPlaceholder")}
        className={cn(
          "w-full rounded-[20px] border bg-[rgba(255,255,255,0.06)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:outline-none",
          compact
            ? "h-11 pl-4 pr-12 text-sm"
            : "h-14 pl-6 pr-28 text-base",
          isFocused
            ? "border-[var(--color-accent-primary)] shadow-[0_0_20px_rgba(0,120,212,0.15)]"
            : "border-[rgba(255,255,255,0.1)]"
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 flex items-center gap-1",
          compact ? "right-2" : "right-3"
        )}
      >
        {!compact && (
          <span className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              aria-label="Upload file"
              className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Browse apps"
              className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </span>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
