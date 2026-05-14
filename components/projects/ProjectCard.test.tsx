import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/config/projects';

const project: Project = {
  slug: 's',
  title: 'Sample',
  description: 'Description here',
  stack: ['TS', 'AWS'],
  href: 'https://example.com',
};

describe('ProjectCard', () => {
  it('renders title, description and stack tags', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { name: 'Sample' })).toBeInTheDocument();
    expect(screen.getByText('Description here')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an anchor with the href when provided', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('link', { name: /view case study/i }))
      .toHaveAttribute('href', 'https://example.com');
  });

  it('omits the link when href is missing', () => {
    render(<ProjectCard project={{ ...project, href: undefined }} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});
