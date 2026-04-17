import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { ProjectIcon } from "@/components/Common/ProjectIcon";
import { CompatibilityBadge } from "@/components/Common/Badge";
import { cn } from "@/utils/cn";
import { useSearch } from "@/data/hooks/useSearch";
import { usePublishers } from "@/data/hooks/usePublishers";
import type { Project, ProjectType, Publisher } from "@/data/types";

interface SearchDropdownProps {
  query: string;
  scope?: ProjectType | "publisher";
  visible: boolean;
  activeIndex: number;
  onSelect: () => void;
  onProjectSelect?: (project: Project) => void;
  onItemCountChange?: (count: number) => void;
}

const PREVIEW_LIMIT = 4;
const FETCH_LIMIT = 100;

export function SearchDropdown({ query, scope, visible, activeIndex, onSelect, onProjectSelect, onItemCountChange }: SearchDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // For projects (apps/games or both)
  const projectType = scope === "publisher" ? undefined : scope;
  const { data: projectResults } = useSearch(
    scope === "publisher" ? "" : query,
    FETCH_LIMIT,
    projectType
  );

  // For publishers
  const { data: publisherResults } = usePublishers(
    scope === "publisher" ? query : undefined,
    1,
    FETCH_LIMIT
  );

  // Report item count to parent for keyboard navigation
  const itemCount = scope === "publisher"
    ? Math.min(publisherResults?.items?.length ?? 0, PREVIEW_LIMIT)
    : Math.min((projectResults ?? []).length, PREVIEW_LIMIT);

  useEffect(() => {
    onItemCountChange?.(visible && query.length >= 2 ? itemCount : 0);
  }, [itemCount, visible, query, onItemCountChange]);

  if (!visible || query.length < 2) return null;

  if (scope === "publisher") {
    return (
      <PublisherDropdown
        query={query}
        publishers={publisherResults?.items ?? []}
        total={publisherResults?.total ?? 0}
        activeIndex={activeIndex}
        navigate={navigate}
        onSelect={onSelect}
        t={t}
      />
    );
  }

  // Projects (apps, games, or both)
  const projects = projectResults ?? [];
  const preview = projects.slice(0, PREVIEW_LIMIT);
  const remaining = projects.length >= FETCH_LIMIT
    ? FETCH_LIMIT
    : projects.length - PREVIEW_LIMIT;

  if (preview.length === 0) {
    return (
      <DropdownShell>
        <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
          {t("search.noResults")}
          <a
            href="https://www.microsoft.com/en-us/fasttrack/microsoft-365/app-assure"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 text-[var(--color-text-link)] hover:underline"
          >
            {t("search.requestAssistance")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </DropdownShell>
    );
  }

  return (
    <DropdownShell>
      <ul id="search-listbox" role="listbox">
        {preview.map((project, index) => (
          <ProjectRow
            key={project.slug}
            project={project}
            isActive={index === activeIndex}
            id={`search-option-${index}`}
            navigate={navigate}
            onSelect={onSelect}
            onProjectSelect={onProjectSelect}
          />
        ))}
      </ul>
      {projects.length > PREVIEW_LIMIT && (
        <ShowMoreRow
          label={t("search.showMore", { count: remaining })}
          onClick={() => {
            const basePath = getProjectSearchPath(scope, projects);
            navigate(`${basePath}?search=${encodeURIComponent(query)}`);
            onSelect();
          }}
        />
      )}
    </DropdownShell>
  );
}

// --- Subcomponents ---

function DropdownShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[var(--color-bg-secondary)] shadow-xl"
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

function ProjectRow({
  project,
  isActive,
  id,
  navigate,
  onSelect,
  onProjectSelect,
}: {
  project: Project;
  isActive: boolean;
  id: string;
  navigate: ReturnType<typeof useNavigate>;
  onSelect: () => void;
  onProjectSelect?: (project: Project) => void;
}) {
  const basePath = project.type === "application" ? "/apps" : "/games";

  return (
    <li
      id={id}
      role="option"
      aria-selected={isActive}
      className={cn(
        "flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors",
        isActive ? "bg-[rgba(255,255,255,0.08)]" : "hover:bg-[rgba(255,255,255,0.06)]"
      )}
      onClick={() => {
        if (onProjectSelect) {
          onProjectSelect(project);
        } else {
          navigate(`${basePath}/${project.slug}`);
        }
        onSelect();
      }}
    >
      <ProjectIcon icon={project.icon} name={project.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
          {project.name}
        </p>
        <p className="truncate text-xs text-[var(--color-text-tertiary)]">
          {project.publisher}
        </p>
      </div>
      <CompatibilityBadge compatibility={project.compatibility} size="sm" />
    </li>
  );
}

function PublisherDropdown({
  query,
  publishers,
  total,
  activeIndex,
  navigate,
  onSelect,
  t,
}: {
  query: string;
  publishers: Publisher[];
  total: number;
  activeIndex: number;
  navigate: ReturnType<typeof useNavigate>;
  onSelect: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const preview = publishers.slice(0, PREVIEW_LIMIT);
  const remaining = total - PREVIEW_LIMIT;

  if (preview.length === 0) {
    return (
      <DropdownShell>
        <div className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
          {t("search.noResults")}
          <a
            href="https://www.microsoft.com/en-us/fasttrack/microsoft-365/app-assure"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 text-[var(--color-text-link)] hover:underline"
          >
            {t("search.requestAssistance")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </DropdownShell>
    );
  }

  return (
    <DropdownShell>
      <ul id="search-listbox" role="listbox">
        {preview.map((publisher, index) => (
          <li
            key={publisher.slug}
            id={`search-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className={cn(
              "flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors",
              index === activeIndex ? "bg-[rgba(255,255,255,0.08)]" : "hover:bg-[rgba(255,255,255,0.06)]"
            )}
            onClick={() => {
              navigate(`/publishers/${publisher.slug}`);
              onSelect();
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(255,255,255,0.06)] text-xs font-semibold text-[var(--color-text-secondary)]">
              {publisher.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {publisher.name}
              </p>
              <p className="truncate text-xs text-[var(--color-text-tertiary)]">
                {t("search.publisherCount", {
                  apps: publisher.appCount,
                  games: publisher.gameCount,
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {total > PREVIEW_LIMIT && (
        <ShowMoreRow
          label={t("search.showMore", { count: remaining })}
          onClick={() => {
            navigate(`/publishers?search=${encodeURIComponent(query)}`);
            onSelect();
          }}
        />
      )}
    </DropdownShell>
  );
}

function ShowMoreRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-[rgba(255,255,255,0.06)] px-4 py-3 text-sm font-medium text-[var(--color-accent-primary)] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
      onClick={onClick}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function getProjectSearchPath(
  scope: ProjectType | undefined,
  projects: Project[]
): string {
  if (scope === "application") return "/apps";
  if (scope === "game") return "/games";
  // For home page (no scope), figure out the majority type
  const appCount = projects.filter((p) => p.type === "application").length;
  const gameCount = projects.filter((p) => p.type === "game").length;
  return appCount >= gameCount ? "/apps" : "/games";
}
