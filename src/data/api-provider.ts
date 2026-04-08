import type { DataProvider } from "./provider";
import type {
  PaginatedResult,
  Project,
  ProjectFilters,
  Category,
  ProjectType,
} from "./types";

/**
 * API Data Provider (Phase 2)
 *
 * Reads from a REST API: GET /api/projects, GET /api/projects/:slug, GET /api/categories
 * Same interface as local provider — swap by changing the factory function.
 */
export class ApiDataProvider implements DataProvider {
  async getProjects(
    _filters?: ProjectFilters,
    _page?: number,
    _pageSize?: number
  ): Promise<PaginatedResult<Project>> {
    throw new Error("Not implemented — use local provider");
  }

  async getProject(_slug: string): Promise<Project | null> {
    throw new Error("Not implemented — use local provider");
  }

  async getCategories(_type?: ProjectType): Promise<Category[]> {
    throw new Error("Not implemented — use local provider");
  }

  async getPopularProjects(_locale?: string, _limit?: number): Promise<Project[]> {
    throw new Error("Not implemented — use local provider");
  }

  async getMicrosoftApps(): Promise<Project[]> {
    throw new Error("Not implemented — use local provider");
  }

  async searchProjects(_query: string, _limit?: number, _type?: ProjectType): Promise<Project[]> {
    throw new Error("Not implemented — use local provider");
  }
}
