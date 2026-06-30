import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as z from 'zod';

import { MessageList } from '~/components/MessageList';
import { RootState } from '~/store';

import { createReduxServer } from '../channel';

export const Route = createFileRoute('/redux-iframe')({
  validateSearch: z.object({
    channelId: z.string().optional(),
  }),

  component: RouteComponent,
});

function RouteComponent() {
  const { channelId } = Route.useSearch();
  const messages = useSelector((state: RootState) => state.app.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!channelId) return;
    // Replay actions received from the host into this document's own store.
    const { channel } = createReduxServer(channelId, dispatch);
    return () => {
      channel.close();
    };
  }, [channelId, dispatch]);

  if (!channelId) {
    return (
      <div className="p-4 flex flex-col gap-2">
        <h2 className="font-semibold text-sm text-gray-500">No channelId provided</h2>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-sm text-gray-500">Synced store (replayed actions)</h2>
      <MessageList messages={messages} />
    </div>
  );
}
