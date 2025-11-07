import { execSync } from "node:child_process";

let cachedDate = null;

export function getLastUpdated() {
  if (!cachedDate) {
    try {
      const stdout = execSync('git log -1 --pretty="format:%ci" -- src/content/applications/').toString().trim();
      cachedDate = new Date(stdout);
    } catch {
      cachedDate = null;
    }
  }
  return cachedDate;
}
