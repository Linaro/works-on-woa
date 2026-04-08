import type {
  Project,
  ProjectFilters,
  PaginatedResult,
  Category,
  ProjectType,
  Publisher,
} from "./types";

export interface DataProvider {
  getProjects(
    filters?: ProjectFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<Project>>;
  getProject(slug: string): Promise<Project | null>;
  getCategories(type?: ProjectType): Promise<Category[]>;
  getPopularProjects(locale?: string, limit?: number): Promise<Project[]>;
  getMicrosoftApps(): Promise<Project[]>;
  searchProjects(query: string, limit?: number, type?: ProjectType): Promise<Project[]>;
  getPublishers(
    search?: string,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<Publisher>>;
  getPublisherBySlug(slug: string): Promise<Publisher | null>;
  getProjectsByPublisher(
    publisherName: string,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<Project>>;
}

let _provider: DataProvider | null = null;

export function setProvider(provider: DataProvider): void {
  _provider = provider;
}

export function getProvider(): DataProvider {
  if (!_provider) {
    throw new Error(
      "DataProvider not initialized. Call setProvider() in App setup."
    );
  }
  return _provider;
}
