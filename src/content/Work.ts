import type { WorkPageContent } from '../types/site.ts';

export const workPageContent = {
  documentTitle: 'Work — Herald Panji',
  eyebrow: 'Work',
  title: 'Work',
  countLabel: 'Projects',
  intro: 'TODO (Herald): one line on what is in this list: the kinds of work and who it was for.',
  listLabel: 'All projects',
  cursorLabel: 'View project',
} as const satisfies WorkPageContent;
