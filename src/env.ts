import { createEnv } from '@t3-oss/env-core';
import { joinURL } from 'ufo';
import * as z from 'zod';

export const env = createEnv({
  shared: {
    baseUrl: z.string().default('/'),
  },
  server: {},
  client: {},
  clientPrefix: 'VITE_',
  runtimeEnv: {
    baseUrl: import.meta.env.BASE_URL,
  },
});

export function appUrl(...paths: string[]) {
  return joinURL(env.baseUrl, ...paths);
}
