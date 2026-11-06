import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TransitionProvider from './TransitionProvider.tsx';

function mockReducedMotion(): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes(': reduce'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function renderApp() {
  const router = createMemoryRouter(
    [
      {
        element: (
          <TransitionProvider>
            <Outlet />
          </TransitionProvider>
        ),
        children: [
          {
            index: true,
            element: (
              <main id="main" tabIndex={-1}>
                <a href="/work">Work link</a>
                <a href="https://example.com/">External link</a>
                <a href="/work" onClick={(event) => event.preventDefault()}>
                  Cancelled link
                </a>
              </main>
            ),
          },
          { path: 'work', element: <h1>Work page</h1> },
        ],
      },
    ],
    { initialEntries: ['/'] },
  );
  const view = render(<RouterProvider router={router} />);
  return { router, ...view };
}

beforeEach(() => {
  mockReducedMotion();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('TransitionProvider', () => {
  it('routes internal links inside the app', async () => {
    const { router } = renderApp();

    fireEvent.click(screen.getByText('Work link'));

    await waitFor(() => expect(router.state.location.pathname).toBe('/work'));
    expect(await screen.findByRole('heading', { name: 'Work page' })).toBeTruthy();
  });

  it('announces the destination for screen readers', async () => {
    renderApp();

    fireEvent.click(screen.getByText('Work link'));

    const status = await screen.findByRole('status');
    await waitFor(() => expect(status.textContent).toBe('Work'));
  });

  it('draws the panel as eight columns of meeting halves, hidden from assistive tech', () => {
    const { container } = renderApp();

    const panel = container.querySelector('.page-transition');
    expect(panel?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.page-transition__column')).toHaveLength(8);
    expect(container.querySelectorAll('.page-transition__half')).toHaveLength(16);
  });

  it('leaves external links to the browser', () => {
    const { router } = renderApp();

    const notPrevented = fireEvent.click(screen.getByText('External link'));

    expect(notPrevented).toBe(true);
    expect(router.state.location.pathname).toBe('/');
  });

  it('leaves modifier clicks to the browser, so links can open in a new tab', () => {
    const { router } = renderApp();

    const notPrevented = fireEvent.click(screen.getByText('Work link'), { ctrlKey: true });

    expect(notPrevented).toBe(true);
    expect(router.state.location.pathname).toBe('/');
  });

  it('respects a click a component already cancelled', () => {
    const { router } = renderApp();

    fireEvent.click(screen.getByText('Cancelled link'));

    expect(router.state.location.pathname).toBe('/');
  });
});
