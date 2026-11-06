import { Outlet, ScrollRestoration } from 'react-router';
import TransitionProvider from '../components/TransitionProvider.tsx';

export default function RootLayout() {
  return (
    <TransitionProvider>
      <Outlet />
      <ScrollRestoration />
    </TransitionProvider>
  );
}
