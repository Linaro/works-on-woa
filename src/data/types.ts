export type ProjectType = "application" | "game";
export type Compatibility = "yes" | "no" | "unknown";
export type EmulationType = "native" | "emulation" | "unknown" | "na";
export type Validation =
  | "microsoft"
  | "qualcomm"
  | "developer"
  | "community"
  | "unverified";

export interface Project {
  slug: string;
  name: string;
  type: ProjectType;
  icon: string;
  categories: string[];
  publisher: string;
  compatibility: Compatibility;
  emulationType: EmulationType;
  compatibilityDetails?: string;
  versionFrom?: string;
  link?: string;
  validation: Validation;
  lastUpdated: string;
  notes?: string;
  isMicrosoftApp?: boolean;
  microsoftCategory?: string;
}

export interface ProjectFilters {
  type?: ProjectType;
  category?: string | string[];
  compatibility?: Compatibility | Compatibility[];
  emulationType?: EmulationType | EmulationType[];
  publisher?: string;
  search?: string;
  isMicrosoftApp?: boolean;
  microsoftCategory?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Category {
  slug: string;
  name: string;
  type: ProjectType;
  count: number;
}

export interface Publisher {
  slug: string;
  name: string;
  appCount: number;
  gameCount: number;
  totalCount: number;
}
