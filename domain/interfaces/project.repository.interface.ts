import type { Project } from '@/content-config';

/**
 * Project repository interface - abstraction for project data access
 */
export interface IProjectRepository {
  getAllProjects(): Project[];
  getProjectById(id: number): Project | undefined;
  getFeaturedProjects(ids?: number[]): Project[];
}





