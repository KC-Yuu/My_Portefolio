export const site = {
  name: 'YOUR_NAME',
  title: 'Software Architect',
  tagline: 'Crafting systems that scale and stories that ship.',
  socials: {
    github: '',
    linkedin: '',
    email: '',
  },
} as const;

export type Site = typeof site;
