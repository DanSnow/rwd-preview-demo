import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import { createServer } from '../channel';

export const Route = createFileRoute('/iframe')({
  validateSearch: z.object({
    channelId: z.string(),
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

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-sm text-gray-500">Received messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-400 text-sm">No messages yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {messages.map((msg, i) => (
            <li key={i} className="bg-gray-800 rounded px-3 py-1.5 text-sm">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
