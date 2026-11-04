import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { projectPageContent, projects } from '../../content/Projects.ts';
import ProjectHero from './ProjectHero.tsx';

vi.mock('../lib/scrollTrigger', () => ({ loadScrollTrigger: () => new Promise<void>(() => {}) }));

afterEach(cleanup);

describe('ProjectHero', () => {
  it('names the page with the project, sizes the title by length and lists the meta', () => {
    const project = projects[0];
    if (!project) throw new Error('needs a project');
    render(
      <MemoryRouter>
        <ProjectHero project={project} position={1} total={projects.length} content={projectPageContent} />
      </MemoryRouter>,
    );
    const title = screen.getByRole('heading', { level: 1, name: project.name });
    expect(title.getAttribute('data-fit')).toBe('16');
    expect(screen.getByRole('region', { name: project.name })).toBeTruthy();
    expect(screen.getByText(`Project 1 of ${projects.length}`)).toBeTruthy();
    expect(screen.getByRole('link', { name: projectPageContent.backLink.label }).getAttribute('href')).toBe(projectPageContent.backLink.href);
    expect(screen.getByRole('img', { name: project.cover.alt })).toBeTruthy();
    expect(screen.getByText(projectPageContent.meta.status)).toBeTruthy();
  });
});
