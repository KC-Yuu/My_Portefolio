export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  image?: string;
  href?: string;
}

export const projects: Project[] = [
  {
    slug: 'p1',
    title: 'Project One',
    description: 'Placeholder description for the first featured project. Replace with a concise outcome-focused summary.',
    stack: ['TypeScript', 'AWS', 'Kafka'],
  },
  {
    slug: 'p2',
    title: 'Project Two',
    description: 'Placeholder description for the second featured project. Replace with a concise outcome-focused summary.',
    stack: ['Go', 'Kubernetes', 'gRPC'],
  },
  {
    slug: 'p3',
    title: 'Project Three',
    description: 'Placeholder description for the third featured project. Replace with a concise outcome-focused summary.',
    stack: ['Rust', 'Postgres', 'DDD'],
  },
];
