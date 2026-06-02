/**
 * Book/site branding for fallbacks and static copy.
 * Most content is edited in Supabase (site_config); set env vars before first deploy.
 */
export const BOOK_SHORT_TITLE =
  process.env.NEXT_PUBLIC_BOOK_SHORT_TITLE?.trim() || "Language of Freedom";

export const SITE_DISPLAY_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
  process.env.RESEND_FROM_NAME?.trim() ||
  BOOK_SHORT_TITLE;

export const EMAIL_FROM_NAME =
  process.env.RESEND_FROM_NAME?.trim() || SITE_DISPLAY_NAME;

export const DEFAULT_BOOK_TITLE = BOOK_SHORT_TITLE;
