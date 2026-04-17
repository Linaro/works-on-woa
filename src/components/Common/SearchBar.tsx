import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { SearchDropdown } from "@/components/Common/SearchDropdown";
import { trackSearch } from "@/lib/telemetry";
import type { Project, ProjectType } from "@/data/types";

interface SearchBarProps {
  className?: string;
  compact?: boolean;
  defaultValue?: string;
  placeholder?: string;
  /** "application" | "game" scopes to that type; "publisher" for publishers; undefined = all */
  scope?: ProjectType | "publisher";
  onSearch?: (query: string) => void;
  onProjectSelect?: (project: Project) => void;
}

export function SearchBar({ className, compact, defaultValue, placeholder, scope, onSearch, onProjectSelect }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultValue ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemCountRef = useRef(0);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync query when defaultValue changes (e.g. URL search param update)
  useEffect(() => {
    setQuery(defaultValue ?? "");
  }, [defaultValue]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setShowDropdown(false);
      if (query.trim()) {
        trackSearch(query.trim());
        if (onSearch) {
          onSearch(query.trim());
        } else {
          navigate(`/apps?search=${encodeURIComponent(query.trim())}`);
        }
      }
    },
    [query, onSearch, navigate]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.length >= 2);
    setActiveIndex(-1);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsFocused(true);
    if (query.length >= 2) {
      setShowDropdown(true);
    }
  }, [query]);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
      setActiveIndex(-1);
    }, 200);
  }, []);

  const handleDropdownSelect = useCallback(() => {
    setShowDropdown(false);
    setActiveIndex(-1);
  }, []);

  const handleItemCountChange = useCallback((count: number) => {
    itemCountRef.current = count;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    const count = itemCountRef.current;
    if (count === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const activeOption = document.getElementById(`search-option-${activeIndex}`);
      if (activeOption) {
        activeOption.click();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  }, [showDropdown, activeIndex]);

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? t("hero.searchPlaceholder")}
        aria-label={placeholder ?? t("hero.searchPlaceholder")}
        role="combobox"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls="search-listbox"
        aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
        autoComplete="off"
        className={cn(
          "w-full rounded-[20px] border bg-[rgba(255,255,255,0.10)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 focus:outline-none",
          compact
            ? "h-11 pl-4 pr-12 text-sm"
            : "h-14 pl-6 pr-12 text-base",
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
        <button
          type="submit"
          aria-label="Search"
          className="rounded-lg p-2 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <SearchDropdown
        query={query}
        scope={scope}
        visible={showDropdown}
        activeIndex={activeIndex}
        onSelect={handleDropdownSelect}
        onProjectSelect={onProjectSelect}
        onItemCountChange={handleItemCountChange}
      />
    </form>
  );
}
