import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import { AnyContractRouter, ContractRouterClient } from '@orpc/contract';
import { implement } from '@orpc/server';
import { RPCHandler } from '@orpc/server/message-port';

import { protocol, Protocol, reduxProtocol, ReduxProtocol, ReduxAction } from './protocol';

function createChannelClient<T extends AnyContractRouter>() {
  const channelId = crypto.randomUUID();
  const channel = new BroadcastChannel(channelId);
  const link = new RPCLink({ port: channel });
  const client: ContractRouterClient<T> = createORPCClient(link);

  return { channelId, channel, client };
}

export function createClient() {
  return createChannelClient<Protocol>();
}

export function createReduxClient() {
  return createChannelClient<ReduxProtocol>();
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

export function createReduxServer(channelId: string, onAction: (action: ReduxAction) => void) {
  const channel = new BroadcastChannel(channelId);

  const os = implement(reduxProtocol);

  const handler = new RPCHandler(
    os.router({
      dispatchAction: os.dispatchAction.handler(({ input }) => onAction(input)),
    }),
  );

  handler.upgrade(channel);

  return {
    channel,
  };
}
