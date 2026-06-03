import { QueryClient } from '@tanstack/react-query';
import { createStore } from 'jotai';

export function createRouterContext() {
  const queryClient = new QueryClient();

  const store = createStore();

  return {
    queryClient,
    store,
  };
}

export type Context = ReturnType<typeof createRouterContext>;
