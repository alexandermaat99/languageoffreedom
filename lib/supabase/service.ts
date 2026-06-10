import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

/**
 * Server-only Supabase client with service role privileges.
 * Use for Stripe webhooks and other trusted backend jobs that must bypass RLS.
 */
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
