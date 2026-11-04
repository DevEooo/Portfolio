import { createBrowserRouter } from 'react-router';
import App from './App.tsx';

export const router = createBrowserRouter([
  { path: '/', Component: App },
  {
    path: '/work/:slug',
    lazy: async () => {
      const [{ default: ProjectPage }, { projectLoader }] = await Promise.all([
        import('./pages/ProjectPage.tsx'),
        import('./pages/projectLoader.ts'),
      ]);
      return { Component: ProjectPage, loader: projectLoader };
    },
  },
]);
