import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { projectPageContent, projects } from '../../content/Projects.ts';
import NextProject from './NextProject.tsx';

afterEach(cleanup);

describe('NextProject', () => {
  it('links to the next project, marked for the custom cursor', () => {
    const next = projects[1];
    if (!next) throw new Error('needs two projects');
    render(
      <MemoryRouter>
        <NextProject next={next} position={2} total={projects.length} content={projectPageContent.next} />
      </MemoryRouter>,
    );
    const nav = screen.getByRole('navigation', { name: projectPageContent.next.navLabel });
    const link = nav.querySelector('a');
    expect(link?.getAttribute('href')).toBe(`/work/${next.slug}`);
    expect(link?.getAttribute('data-cursor')).toBe('project');
    expect(link?.textContent).toContain(next.name);
    expect(link?.textContent).toContain(`02 / 0${projects.length}`);
  });
});
