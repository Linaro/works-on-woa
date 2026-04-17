import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CompatibilityBadge } from "@/components/Common/Badge";
import { formatCategory } from "@/utils/formatting";
import type { Project } from "@/data/types";

interface AppCardProps {
  project: Project;
}

export function AppCard({ project }: AppCardProps) {
  const navigate = useNavigate();
  const detailPath =
    project.type === "application"
      ? `/apps/${project.slug}`
      : `/games/${project.slug}`;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => navigate(detailPath)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 transition-colors hover:border-[rgba(0,120,212,0.3)]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[rgba(0,120,212,0.08)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.06)] text-lg font-bold text-[var(--color-accent)]">
          {project.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[var(--color-text-primary)]">
            {project.name}
          </h3>
          {project.publisher && (
            <p className="mt-0.5 truncate text-sm text-[var(--color-text-tertiary)]">
              {project.publisher}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CompatibilityBadge compatibility={project.compatibility} size="sm" />
            {project.categories[0] && project.categories[0] !== "unknown" && (
              <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs text-[var(--color-text-tertiary)]">
                {formatCategory(project.categories[0])}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
