import { createClient } from "@insforge/sdk";

/**
 * Single shared InsForge client. Works in the browser (client components)
 * and in Node (server components call lib/api.ts). Reads the public project
 * URL and anon key from .env.local — never hardcode keys here.
 */
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
