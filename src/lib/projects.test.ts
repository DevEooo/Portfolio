import { describe, expect, it } from 'vitest';
import { projects } from '../content/Projects.ts';
import { findProject } from './projects.ts';

describe('findProject', () => {
  it('finds a project with its position and the next one', () => {
    const found = findProject(projects, 'project-02');
    expect(found?.project.name).toBe('LokaRasa');
    expect(found?.position).toBe(2);
    expect(found?.total).toBe(projects.length);
    expect(found?.next.slug).toBe('project-03');
    expect(found?.nextPosition).toBe(3);
  });

  it('wraps from the last project to the first', () => {
    const last = projects[projects.length - 1];
    const found = findProject(projects, last?.slug);
    expect(found?.next.slug).toBe(projects[0]?.slug);
    expect(found?.nextPosition).toBe(1);
  });

  it('returns null for an unknown or missing slug', () => {
    expect(findProject(projects, 'nope')).toBeNull();
    expect(findProject(projects, undefined)).toBeNull();
  });
});
