import { joinURL } from 'ufo';

// Server-only env vars removed for SPA/static build.
// Add client-side VITE_* vars here if needed.
export const env = {
  baseUrl: import.meta.env.BASE_URL,
};

export function appUrl(...paths: string[]) {
  return joinURL(env.baseUrl, ...paths);
}
