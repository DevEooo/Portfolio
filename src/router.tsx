import { createBrowserRouter } from 'react-router';
import App from './App.tsx';
import RootLayout from './pages/RootLayout.tsx';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: App },
      {
        path: 'work/:slug',
        lazy: async () => {
          const [{ default: ProjectPage }, { projectLoader }] = await Promise.all([
            import('./pages/ProjectPage.tsx'),
            import('./pages/projectLoader.ts'),
          ]);
          return { Component: ProjectPage, loader: projectLoader };
        },
      },
    ],
  },
]);
