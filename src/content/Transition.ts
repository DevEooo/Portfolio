import type { TransitionContent } from '../types/site.ts';

export const transitionContent = {
  nextPageLabel: 'Next page',
  nextProjectLabel: 'Next project',
  pageNames: { '/': 'Index', '/work': 'Work', '/about': 'About', '/contact': 'Contact' },
} as const satisfies TransitionContent;
