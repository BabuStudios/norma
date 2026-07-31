import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from '@/state/AppProvider';

/** Exposes the router's current path so tests can assert on navigation. */
function CurrentPath() {
  const { pathname } = useLocation();
  return <span data-testid="pathname">{pathname}</span>;
}

/**
 * Renders a screen inside the app's providers on a real route, and hands back
 * a `user` bound to the same document. Screens read route params, so the route
 * pattern matters: pass `path` when the screen takes one.
 */
export function renderScreen(
  ui: ReactElement,
  { route = '/', path = '*' }: { route?: string; path?: string } = {},
) {
  const user = userEvent.setup();
  const result = render(
    <AppProvider>
      <MemoryRouter initialEntries={[route]}>
        <CurrentPath />
        <Routes>
          <Route path={path} element={ui} />
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
  return { ...result, user };
}
