import { oc } from '@orpc/contract';
import * as z from 'zod';

export const protocol = oc.router({
  sendMessage: oc.input(z.object({ content: z.string() })),
});

export type Protocol = typeof protocol;
