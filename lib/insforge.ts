import { createClient } from "@insforge/sdk";

const envUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const envKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

/**
 * Checks if a real, live InsForge backend is configured.
 * The original demonstration host (565htiv4) was decommissioned upstream.
 * If this is false, the app runs entirely in high-speed local mode.
 */
export const isInsForgeAvailable = Boolean(
  envUrl &&
    !envUrl.includes("565htiv4") &&
    !envUrl.includes("your-project") &&
    !envUrl.includes("placeholder") &&
    envKey &&
    envKey !== "ik_placeholder_anon_key" &&
    envKey !== "ik_placeholder" &&
    envKey !== "your-anon-key"
);

const effectiveUrl = isInsForgeAvailable && envUrl ? envUrl : "https://placeholder.insforge.app";
const effectiveKey = isInsForgeAvailable && envKey ? envKey : "ik_placeholder";

export const insforge = createClient({
  baseUrl: effectiveUrl,
  anonKey: effectiveKey,
});

