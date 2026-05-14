import { ProjectCard } from './ProjectCard';
import { projects } from '@/config/projects';

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-24 px-6 md:px-16"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <header className="flex items-center gap-3 mb-10">
        <span className="pixel text-2xl" aria-hidden style={{ color: 'var(--accent)' }}>★</span>
        <h2
          id="projects-heading"
          className="pixel pixel-font text-3xl md:text-4xl"
          style={{ color: 'var(--ink)' }}
        >
          Featured Projects
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
