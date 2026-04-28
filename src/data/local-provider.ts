import type { DataProvider } from "./provider";
import { formatCategory } from "@/utils/formatting";
import { publisherIcons } from "./content/publisher-icons";
import type {
  Project,
  ProjectFilters,
  PaginatedResult,
  Category,
  ProjectType,
  Publisher,
} from "./types";

let projects: Project[] | null = null;
let popularAppsByLocale: Record<string, string[]> | null = null;

async function getProjects(): Promise<Project[]> {
  if (!projects) {
    const mod = await import("./content/projects.json");
    projects = mod.default as Project[];
  }
  return projects;
}

async function getPopularAppsData(): Promise<Record<string, string[]>> {
  if (!popularAppsByLocale) {
    const mod = await import("./content/popular-apps-by-locale.json");
    popularAppsByLocale = mod.default as Record<string, string[]>;
  }
  return popularAppsByLocale;
}

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
      result = result.filter((p) => (comps as string[]).includes(p.compatibility as string));
    }
  }
  if (filters.emulationType) {
    const ems = Array.isArray(filters.emulationType) ? filters.emulationType : [filters.emulationType];
    if (ems.length > 0) {
      result = result.filter((p) => (ems as string[]).includes(p.emulationType as string));
    }
  }
  if (filters.publisher) {
    const pubs = Array.isArray(filters.publisher) ? filters.publisher : [filters.publisher];
    if (pubs.length > 0) {
      const lower = pubs.map((p) => p.toLowerCase());
      result = result.filter((p) =>
        lower.some((pub) => p.publisher.toLowerCase() === pub)
      );
    }
  }
  if (filters.isMicrosoftApp !== undefined) {
    result = result.filter((p) => p.isMicrosoftApp === filters.isMicrosoftApp);
  }
  if (filters.lastUpdated) {
    const ranges = Array.isArray(filters.lastUpdated) ? filters.lastUpdated : [filters.lastUpdated];
    if (ranges.length > 0) {
      const now = new Date();
      const cutoffs = ranges.map((r) => {
        const d = new Date(now);
        switch (r) {
          case "7d": d.setDate(d.getDate() - 7); break;
          case "30d": d.setDate(d.getDate() - 30); break;
          case "90d": d.setDate(d.getDate() - 90); break;
          case "1y": d.setFullYear(d.getFullYear() - 1); break;
          default: return null;
        }
        return d;
      }).filter(Boolean) as Date[];
      if (cutoffs.length > 0) {
        const earliest = new Date(Math.min(...cutoffs.map((c) => c.getTime())));
        result = result.filter((p) => new Date(p.lastUpdated) >= earliest);
      }
    }
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
    const allProjects = await getProjects();
    const filtered = applyFilters(allProjects, filters);
    return paginate(filtered, page, pageSize);
  }

  async getProject(slug: string): Promise<Project | null> {
    const allProjects = await getProjects();
    return allProjects.find((p) => p.slug === slug) ?? null;
  }

  async getCategories(type?: ProjectType): Promise<Category[]> {
    const allProjects = await getProjects();
    const filtered = type
      ? allProjects.filter((p) => p.type === type)
      : allProjects;

    const categoryMap = new Map<string, { name: string; type: ProjectType; count: number }>();

    for (const project of filtered) {
      for (const cat of project.categories) {
        const existing = categoryMap.get(cat);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(cat, {
            name: formatCategory(cat),
            type: project.type,
            count: 1,
          });
        }
      }
    }

    return Array.from(categoryMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPopularProjects(locale = "en", limit = 10): Promise<Project[]> {
    const allProjects = await getProjects();
    const popData = await getPopularAppsData();
    const localeSlugs = popData[locale];
    const slugs = localeSlugs?.length ? localeSlugs : (popData.en ?? []);

    const slugSet = new Set(slugs.slice(0, limit));
    const projectMap = new Map<string, Project>();
    for (const p of allProjects) {
      if (slugSet.has(p.slug)) {
        projectMap.set(p.slug, p);
      }
    }

    // Return in the order defined by the slug list
    return slugs
      .slice(0, limit)
      .map((slug) => projectMap.get(slug))
      .filter((p): p is Project => p != null);
  }

  async getMicrosoftApps(): Promise<Project[]> {
    const allProjects = await getProjects();
    return allProjects.filter((p) => p.isMicrosoftApp === true);
  }

  async searchProjects(query: string, limit = 20, type?: ProjectType): Promise<Project[]> {
    const allProjects = await getProjects();
    const q = query.toLowerCase();
    return allProjects
      .filter(
        (p) =>
          (!type || p.type === type) &&
          (p.name.toLowerCase().includes(q) ||
          p.publisher.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)))
      )
      .slice(0, limit);
  }

  private async buildPublishers(): Promise<Publisher[]> {
    const allProjects = await getProjects();
    const map = new Map<string, { appCount: number; gameCount: number }>();
    for (const p of allProjects) {
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
        icon: publisherIcons[name],
        appCount: counts.appCount,
        gameCount: counts.gameCount,
        totalCount: counts.appCount + counts.gameCount,
      }))
      .sort((a, b) => {
        const aIsMicrosoft = a.name.toLowerCase() === "microsoft corporation";
        const bIsMicrosoft = b.name.toLowerCase() === "microsoft corporation";
        if (aIsMicrosoft && !bIsMicrosoft) return -1;
        if (!aIsMicrosoft && bIsMicrosoft) return 1;
        return b.totalCount - a.totalCount;
      });
  }

  async getPublishers(
    search?: string,
    page = 1,
    pageSize = 25
  ): Promise<PaginatedResult<Publisher>> {
    let publishers = await this.buildPublishers();
    if (search) {
      const q = search.toLowerCase();
      publishers = publishers.filter((p) => p.name.toLowerCase().includes(q));
    }
    return paginate(publishers, page, pageSize);
  }

  async getPublisherBySlug(slug: string): Promise<Publisher | null> {
    const publishers = await this.buildPublishers();
    return publishers.find((p) => p.slug === slug) ?? null;
  }

  async getProjectsByPublisher(
    publisherName: string,
    page = 1,
    pageSize = 25
  ): Promise<PaginatedResult<Project>> {
    const allProjects = await getProjects();
    const filtered = allProjects.filter(
      (p) => p.publisher.toLowerCase() === publisherName.toLowerCase()
    );
    return paginate(filtered, page, pageSize);
  }
}
