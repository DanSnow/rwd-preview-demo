import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '~/components/ui/button';
import { MessageList } from '~/components/MessageList';
import { RootState, listenerMiddleware } from '~/store';
import { addMessage, appSlice } from '~/store/app';

import { createReduxClient } from '../channel';

export const Route = createFileRoute('/redux')({
  component: RouteComponent,
});

function RouteComponent() {
  const messages = useSelector((state: RootState) => state.app.messages);
  const dispatch = useDispatch();

  const [input, setInput] = useState('');
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    const { channelId, channel, client } = createReduxClient();
    setChannelId(channelId);

    // Subscribe to dispatched actions and forward each one to the preview so
    // its Redux store can replay it and stay in sync.
    const unsubscribe = listenerMiddleware.startListening({
      predicate: (action) => action.type.startsWith(`${appSlice.name}/`),
      effect: (action) => {
        client.dispatchAction({ type: action.type, payload: action.payload });
      },
    });

    return () => {
      unsubscribe();
      channel.close();
    };
  }, []);

  function handleAdd() {
    const content = input.trim();
    if (!content) return;
    dispatch(addMessage(content));
    setInput('');
  }

  return (
    <div className="p-4 flex flex-col gap-4 h-screen">
      <h1 className="text-xl font-bold">Redux Sync Demo</h1>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: host controls and store */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add a message..."
              className="border px-3 py-1.5 rounded flex-1"
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          <div>
            <h2 className="font-semibold text-sm text-gray-500 mb-1">Host store</h2>
            <MessageList messages={messages} />
          </div>
        </div>

        {/* Right: preview iframe */}
        {channelId && (
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div>
              <Button
                variant="outline"
                onClick={() => window.open(`/redux-iframe?channelId=${channelId}`, '_blank')}
              >
                Open preview in new page
              </Button>
            </div>
            <iframe
              src={`/redux-iframe?channelId=${channelId}`}
              className="flex-1 border rounded"
              title="redux preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
