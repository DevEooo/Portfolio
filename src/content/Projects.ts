import type { ProjectDetail, ProjectMedia, ProjectPageContent, ProjectStage } from '../types/site.ts';

export const projectPageContent = {
  documentTitle: '{name} — Herald Panji',
  backLink: { label: '← Back to index', href: '/' },
  counterLabel: 'Project {current} of {total}',
  scrollCue: 'Scroll down',
  meta: { type: 'Type', year: 'Year', status: 'Status' },
  overviewLabel: 'Project overview',
  gallery: {
    label: 'Gallery',
    previous: 'Previous image',
    next: 'Next image',
    open: 'Open image {current} of {total}: {alt}',
    viewer: 'Image viewer',
    close: 'Close image',
  },
  process: {
    heading: 'How it was made',
    navLabel: 'Project stages',
    stageTitles: { research: 'Research', plan: 'Plan', design: 'Design', build: 'Build', launch: 'Launch' },
  },
  next: {
    navLabel: 'Next project',
    title: 'Next project',
    linkLabel: 'Next project: {name}',
    cursorLabel: 'LET’S GO!',
  },
} as const satisfies ProjectPageContent;

const PLACEHOLDER_SIZE = { width: 1920, height: 1280 } as const;
const GALLERY_COUNT = 6;

const todoImage = (what: string): ProjectMedia => ({ src: null, alt: `TODO: ${what}`, ...PLACEHOLDER_SIZE });

const todoStages: readonly ProjectStage[] = [
  { id: 'research', body: 'TODO: The problem: what was not working before, and for whom. Two or three sentences.' },
  { id: 'plan', body: 'TODO: The scope you agreed on: the key features, what was left out, and why.' },
  { id: 'design', body: 'TODO: How it should look and work: the flow or screen decision that mattered most.' },
  { id: 'build', body: 'TODO: How you built it: the stack, the AI part, the tools it connects to, and one hard problem you solved.' },
  { id: 'launch', body: 'TODO: How it went live and what happened after: who uses it, feedback, what you would do next.' },
];

const todoProject = (slug: string, name: string): ProjectDetail => ({
  slug,
  name,
  type: 'TODO: type',
  year: 'TODO',
  status: 'TODO: status',
  overview: 'TODO: One or two sentences: what this project is, who it is for, and the problem it takes away.',
  cover: todoImage(`${name} cover image`),
  gallery: Array.from({ length: GALLERY_COUNT }, (_, i) => todoImage(`${name} screenshot ${i + 1}`)),
  stages: todoStages,
});

export const projects: readonly ProjectDetail[] = [
  todoProject('project-01', '3D Food Stall'),
  todoProject('project-02', 'LokaRasa'),
  todoProject('project-03', 'Dying Light'),
  todoProject('project-04', 'LeMobile'),
  todoProject('project-05', 'CoffeeApp'),
];
