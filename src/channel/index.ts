import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import { ContractRouterClient } from '@orpc/contract';
import { implement } from '@orpc/server';
import { RPCHandler } from '@orpc/server/message-port';

import { protocol, Protocol } from './protocol';

export function createClient() {
  const channelId = crypto.randomUUID();

  const channel = new BroadcastChannel(channelId);

  const link = new RPCLink({
    port: channel,
  });

  const client: ContractRouterClient<Protocol> = createORPCClient(link);

  return {
    channelId,
    client,
  };
}

export function createServer(channelId: string, onMessage: (message: string) => void) {
  const channel = new BroadcastChannel(channelId);

  const os = implement(protocol);

  const handler = new RPCHandler(
    os.router({
      sendMessage: os.sendMessage.handler(({ input }) => onMessage(input.content)),
    }),
  );

  handler.upgrade(channel);

  return {
    channel,
  };
}
