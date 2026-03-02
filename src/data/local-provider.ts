import type { DataProvider } from "./provider";
import type {
  Project,
  ProjectFilters,
  PaginatedResult,
  Category,
  ProjectType,
  Publisher,
} from "./types";

import projectsData from "./content/projects.json";

const projects: Project[] = projectsData as Project[];

function applyFilters(items: Project[], filters?: ProjectFilters): Project[] {
  if (!filters) return items;

  let result = items;

  if (filters.type) {
    result = result.filter((p) => p.type === filters.type);
  }
  if (filters.category) {
    const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
    if (cats.length > 0) {
      result = result.filter((p) => cats.some((c) => p.categories.includes(c)));
    }
  }
  if (filters.compatibility) {
    const comps = Array.isArray(filters.compatibility) ? filters.compatibility : [filters.compatibility];
    if (comps.length > 0) {
      result = result.filter((p) => comps.includes(p.compatibility as any));
    }
  }
  if (filters.emulationType) {
    const ems = Array.isArray(filters.emulationType) ? filters.emulationType : [filters.emulationType];
    if (ems.length > 0) {
      result = result.filter((p) => ems.includes(p.emulationType as any));
    }
  }
  if (filters.publisher) {
    result = result.filter(
      (p) =>
        p.publisher.toLowerCase().includes(filters.publisher!.toLowerCase())
    );
  }
  if (filters.isMicrosoftApp !== undefined) {
    result = result.filter((p) => p.isMicrosoftApp === filters.isMicrosoftApp);
  }
  if (filters.microsoftCategory) {
    result = result.filter(
      (p) => p.microsoftCategory === filters.microsoftCategory
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.publisher.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
  }

  return result;
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export class LocalDataProvider implements DataProvider {
  async getProjects(
    filters?: ProjectFilters,
    page = 1,
    pageSize = 25
  ): Promise<PaginatedResult<Project>> {
    const filtered = applyFilters(projects, filters);
    return paginate(filtered, page, pageSize);
  }

  async getProject(slug: string): Promise<Project | null> {
    return projects.find((p) => p.slug === slug) ?? null;
  }

  async getCategories(type?: ProjectType): Promise<Category[]> {
    const filtered = type
      ? projects.filter((p) => p.type === type)
      : projects;

    const categoryMap = new Map<string, { name: string; type: ProjectType; count: number }>();

    for (const project of filtered) {
      for (const cat of project.categories) {
        const existing = categoryMap.get(cat);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(cat, {
            name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
            type: project.type,
            count: 1,
          });
        }
      }
    }

    return Array.from(categoryMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count);
  }

  async getPopularProjects(limit = 10): Promise<Project[]> {
    return projects
      .filter((p) => p.type === "application" && p.compatibility === "yes")
      .slice(0, limit);
  }

  async getMicrosoftApps(): Promise<Project[]> {
    return projects.filter((p) => p.isMicrosoftApp === true);
  }

  async searchProjects(query: string, limit = 20): Promise<Project[]> {
    const q = query.toLowerCase();
    return projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.publisher.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, limit);
  }

  private buildPublishers(): Publisher[] {
    const map = new Map<string, { appCount: number; gameCount: number }>();
    for (const p of projects) {
      if (!p.publisher) continue;
      const existing = map.get(p.publisher);
      if (existing) {
        if (p.type === "application") existing.appCount++;
        else existing.gameCount++;
      } else {
        map.set(p.publisher, {
          appCount: p.type === "application" ? 1 : 0,
          gameCount: p.type === "game" ? 1 : 0,
        });
      }
    }
    return Array.from(map.entries())
      .map(([name, counts]) => ({
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        name,
        appCount: counts.appCount,
        gameCount: counts.gameCount,
        totalCount: counts.appCount + counts.gameCount,
      }))
      .sort((a, b) => b.totalCount - a.totalCount);
  }

  async getPublishers(
    search?: string,
    page = 1,
    pageSize = 25
  ): Promise<PaginatedResult<Publisher>> {
    let publishers = this.buildPublishers();
    if (search) {
      const q = search.toLowerCase();
      publishers = publishers.filter((p) => p.name.toLowerCase().includes(q));
    }
    return paginate(publishers, page, pageSize);
  }

  async getPublisherBySlug(slug: string): Promise<Publisher | null> {
    const publishers = this.buildPublishers();
    return publishers.find((p) => p.slug === slug) ?? null;
  }

  async getProjectsByPublisher(
    publisherName: string,
    page = 1,
    pageSize = 25
  ): Promise<PaginatedResult<Project>> {
    const filtered = projects.filter(
      (p) => p.publisher.toLowerCase() === publisherName.toLowerCase()
    );
    return paginate(filtered, page, pageSize);
  }
}
