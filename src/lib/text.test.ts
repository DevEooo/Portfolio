import { describe, expect, it } from 'vitest';
import { fillTemplate, padIndex, titleFit, titleFitByWord, TITLE_FIT_MAX, TITLE_FIT_MIN } from './text.ts';

describe('text helpers', () => {
  it('pads indexes to two digits', () => {
    expect(padIndex(3)).toBe('03');
    expect(padIndex(12)).toBe('12');
  });

  it('fills known tokens and leaves unknown ones', () => {
    expect(fillTemplate('Project {current} of {total}', { current: 2, total: 5 })).toBe('Project 2 of 5');
    expect(fillTemplate('{name} — {missing}', { name: 'LokaRasa' })).toBe('LokaRasa — {missing}');
  });

  it('rounds title length up to the next size step, within limits', () => {
    expect(titleFit('LokaRasa')).toBe(8);
    expect(titleFit('Project Name')).toBe(12);
    expect(titleFit('3D Food Stall')).toBe(16);
    expect(titleFit('AI')).toBe(TITLE_FIT_MIN);
    expect(titleFit('x'.repeat(60))).toBe(TITLE_FIT_MAX);
  });

  it('sizes narrow titles by their longest word', () => {
    expect(titleFitByWord('Document Extraction Suite')).toBe(titleFit('Extraction'));
  });
});
