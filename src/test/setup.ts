import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  // The store persists to localStorage, so one test's clicks would otherwise
  // seed the next test's initial state.
  window.localStorage.clear();
});
