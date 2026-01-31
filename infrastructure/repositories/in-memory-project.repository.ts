import { featuredProjectIds, projectList } from '@/constant/constant';
import type { Project } from '@/content-config';
import type { IProjectRepository } from '@/domain/interfaces/project.repository.interface';

/**
 * In-memory project repository implementation
 */
export class InMemoryProjectRepository implements IProjectRepository {
  private projects: Project[];

  constructor() {
    // Convert constant projectList to Project[] type
    this.projects = projectList.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      link: p.link,
      tags: p.tags,
      year: p.year,
      slug: p.slug,
      author: p.author,
      readTime: p.readTime,
      viewCount: (p as any).viewCount || 0,
      tldr: p.tldr,
      fullDescription: p.fullDescription,
      features: p.features,
      lessonsLearned: p.lessonsLearned,
    }));
  }

  getAllProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  getFeaturedProjects(ids?: number[]): Project[] {
    const featuredIds = ids && ids.length > 0 ? ids : featuredProjectIds;

    return featuredIds
      .map((id) => this.projects.find((project) => project.id === id))
      .filter((project): project is Project => project !== undefined)
      .sort((a, b) => {
        const yearDiff = (b.year || 0) - (a.year || 0);
        if (yearDiff !== 0) return yearDiff;
        return b.id - a.id;
      });
  }
}




