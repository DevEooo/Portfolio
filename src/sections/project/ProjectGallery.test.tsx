import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { projectPageContent, projects } from '../../content/Projects.ts';
import ProjectGallery from './ProjectGallery.tsx';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(cleanup);

const images = projects[0]?.gallery ?? [];
const content = projectPageContent.gallery;

function renderGallery() {
  return render(<ProjectGallery images={images} content={content} />);
}

describe('ProjectGallery', () => {
  it('is a named region with a counter, arrows and one open button per image', () => {
    renderGallery();
    const region = screen.getByRole('region', { name: content.label });
    expect(within(region).getByText(`01 / 0${images.length}`)).toBeTruthy();
    expect(within(region).getAllByRole('button', { name: /^Open image/ })).toHaveLength(images.length);
    expect((screen.getByRole('button', { name: content.previous }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('opens the clicked image in inspect mode and closes with the X', () => {
    renderGallery();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /^Open image 2 of/ }));
    });
    const dialog = screen.getByRole('dialog', { name: content.viewer });
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(within(dialog).getByText(`02 / 0${images.length}`)).toBeTruthy();

    act(() => {
      fireEvent.click(within(dialog).getByRole('button', { name: content.close }));
    });
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(within(dialog).queryByRole('img')).toBeNull();
  });

  it('closes when the background (the dialog itself) is clicked, not the image', () => {
    renderGallery();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /^Open image 1 of/ }));
    });
    const dialog = screen.getByRole('dialog', { name: content.viewer });

    act(() => {
      fireEvent.click(within(dialog).getByRole('img'));
    });
    expect(dialog.hasAttribute('open')).toBe(true);

    act(() => {
      fireEvent.click(dialog);
    });
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('renders nothing without images', () => {
    const { container } = render(<ProjectGallery images={[]} content={content} />);
    expect(container.innerHTML).toBe('');
  });
});
