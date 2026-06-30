import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';

import { createClient } from '../channel';
import { appUrl } from '../env';
import type { ContractRouterClient } from '@orpc/contract';
import type { Protocol } from '../channel/protocol';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [input, setInput] = useState('');
  const [channelId, setChannelId] = useState<string | null>(null);
  const clientRef = useRef<ContractRouterClient<Protocol> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { channelId, client } = createClient();
    clientRef.current = client;
    setChannelId(channelId);
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const content = input.trim();
    if (!content || !clientRef.current) return;
    await clientRef.current.sendMessage({ content });
    setInput('');
  }

  return (
    <div className="p-4 flex flex-col gap-4 h-screen">
      <h1 className="text-xl font-bold">Channel Demo</h1>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="border px-3 py-1.5 rounded flex-1"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
      {channelId && (
        <>
          <div>
            <Button variant="outline" onClick={() => window.open(appUrl(`/iframe?channelId=${channelId}`), '_blank')}>
              Open in new page
            </Button>
          </div>
          <iframe
            src={appUrl(`/iframe?channelId=${channelId}`)}
            className="flex-1 border rounded"
            title="iframe receiver"
          />
        </>
      )}
    </div>
  );
}
