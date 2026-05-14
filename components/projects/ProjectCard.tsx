import { PixelFrame } from '@/components/shared/PixelFrame';
import type { Project } from '@/config/projects';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <PixelFrame className="p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1">
      <div
        className="pixel w-full aspect-video flex items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, var(--sky-top) 0%, var(--ground) 100%)',
          color: 'var(--paper)',
        }}
        aria-hidden="true"
      >
        <span className="text-2xl">★</span>
      </div>
      <h3 className="pixel pixel-font text-xl" style={{ color: 'var(--ink)' }}>
        {project.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
        {project.description}
      </p>
      <ul className="flex flex-wrap gap-2">
        {project.stack.map((tag) => (
          <li
            key={tag}
            className="pixel pixel-font text-xs px-2 py-1"
            style={{ background: 'var(--foliage)', color: 'var(--paper)' }}
          >
            {tag}
          </li>
        ))}
      </ul>
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          View case study →
        </a>
      )}
    </PixelFrame>
  );
}
