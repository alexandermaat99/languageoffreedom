import Stripe from 'stripe';

export type StripeKeyMode = 'test' | 'live';

export function getStripeKeyMode(key: string | undefined): StripeKeyMode | null {
  if (!key) return null;
  if (key.startsWith('sk_test_') || key.startsWith('pk_test_')) return 'test';
  if (key.startsWith('sk_live_') || key.startsWith('pk_live_')) return 'live';
  return null;
}

export function validateStripeKeyPair(): { ok: true; mode: StripeKeyMode } | { ok: false; error: string } {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!secretKey) {
    return { ok: false, error: 'STRIPE_SECRET_KEY is not configured.' };
  }
  if (!publishableKey) {
    return { ok: false, error: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.' };
  }

  const secretMode = getStripeKeyMode(secretKey);
  const publishableMode = getStripeKeyMode(publishableKey);

  if (!secretMode) {
    return { ok: false, error: 'STRIPE_SECRET_KEY is invalid. It must start with sk_test_ or sk_live_.' };
  }
  if (!publishableMode) {
    return { ok: false, error: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is invalid. It must start with pk_test_ or pk_live_.' };
  }
  if (secretMode !== publishableMode) {
    return {
      ok: false,
      error: `Stripe key mismatch: server uses ${secretMode} mode but publishable key is ${publishableMode} mode. Use matching test or live keys from the same Stripe account, then redeploy.`,
    };
  }

  return { ok: true, mode: secretMode };
}

// Initialize Stripe client
// Note: The Stripe Node SDK uses the latest API version by default
// This supports automatic tax with Checkout Sessions
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

