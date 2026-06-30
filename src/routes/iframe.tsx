import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import { MessageList } from '~/components/MessageList';

import { createServer } from '../channel';

export const Route = createFileRoute('/iframe')({
  validateSearch: z.object({
    channelId: z.string().optional(),
  }),

  component: RouteComponent,
});

function RouteComponent() {
  const { channelId } = Route.useSearch();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!channelId) return;
    const { channel } = createServer(channelId, (msg) => setMessages((prev) => [...prev, msg]));
    return () => {
      channel.close();
    };
  }, [channelId]);

  if (!channelId) {
    return (
      <div className="p-4 flex flex-col gap-2">
        <h2 className="font-semibold text-sm text-gray-500">No channelId provided</h2>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-sm text-gray-500">Received messages</h2>
      <MessageList messages={messages} />
    </div>
  );
}
