import { oc } from '@orpc/contract';
import * as z from 'zod';

export const protocol = oc.router({
  sendMessage: oc.input(z.object({ content: z.string() })),
});

export type Protocol = typeof protocol;

export const reduxProtocol = oc.router({
  dispatchAction: oc.input(z.object({ type: z.string(), payload: z.unknown() })),
});

export type ReduxProtocol = typeof reduxProtocol;

export type ReduxAction = { type: string; payload: unknown };
