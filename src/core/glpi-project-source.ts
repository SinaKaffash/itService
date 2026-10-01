import type { PublicProject } from "@/core/operations";

/**
 * Phase-2 boundary for importing project progress from GLPI without changing
 * the public read model or page components.
 */
export interface GlpiProjectSource {
  listProjects(): Promise<readonly PublicProject[]>;
}
