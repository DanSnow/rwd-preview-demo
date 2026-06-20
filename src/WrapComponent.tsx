import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import type { Context } from './router-context';
import { store } from './store';

export function WrapComponent({ children, context }: { children: ReactNode; context: Context }) {
  return (
    <QueryClientProvider client={context.queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
}
