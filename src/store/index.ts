import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { reducer } from './app';

// Lets callers subscribe to dispatched actions (events) at runtime, e.g. to
// forward them to a connected preview for state syncing.
export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
