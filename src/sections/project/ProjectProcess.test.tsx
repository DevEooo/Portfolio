import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { projectPageContent, projects } from '../../content/Projects.ts';
import ProjectProcess from './ProjectProcess.tsx';

vi.mock('../lib/scrollTrigger', () => ({ loadScrollTrigger: () => new Promise<void>(() => {}) }));

afterEach(cleanup);

const stages = projects[0]?.stages ?? [];
const content = projectPageContent.process;

describe('ProjectProcess', () => {
  it('is a region named by its hidden heading', () => {
    render(<ProjectProcess stages={stages} content={content} />);
    expect(screen.getByRole('region', { name: content.heading })).toBeTruthy();
  });

  it('lists every stage in the index, linking to its section, with the first current', () => {
    render(<ProjectProcess stages={stages} content={content} />);
    const nav = screen.getByRole('navigation', { name: content.navLabel });
    const links = within(nav).getAllByRole('link');
    expect(links.map((a) => a.textContent)).toEqual(['Research', 'Plan', 'Design', 'Build', 'Launch']);
    expect(links[0]?.getAttribute('aria-current')).toBe('step');
    expect(links.slice(1).every((a) => !a.hasAttribute('aria-current'))).toBe(true);

    links.forEach((a) => {
      const target = document.querySelector(a.getAttribute('href') ?? '#none');
      expect(target?.tagName).toBe('ARTICLE');
    });
  });

  it('shows each stage with its title and text', () => {
    render(<ProjectProcess stages={stages} content={content} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Research', 'Plan', 'Design', 'Build', 'Launch']);
    expect(screen.getByText(stages[0]?.body ?? '')).toBeTruthy();
  });
});
