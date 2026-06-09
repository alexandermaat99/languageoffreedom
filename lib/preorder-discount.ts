export interface PreorderDiscountConfig {
  enabled: boolean;
  percent: number;
}

export const DEFAULT_PREORDER_DISCOUNT: PreorderDiscountConfig = {
  enabled: true,
  percent: 15,
};

export function normalizePreorderDiscount(raw: unknown): PreorderDiscountConfig {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PREORDER_DISCOUNT };
  }

  const value = raw as Record<string, unknown>;
  const enabled =
    typeof value.enabled === 'boolean' ? value.enabled : DEFAULT_PREORDER_DISCOUNT.enabled;

  let percent =
    typeof value.percent === 'number' ? value.percent : DEFAULT_PREORDER_DISCOUNT.percent;
  if (!Number.isFinite(percent)) {
    percent = DEFAULT_PREORDER_DISCOUNT.percent;
  }
  percent = Math.min(100, Math.max(0, percent));

  return { enabled, percent };
}

export function calculatePreorderDiscount(
  basePrice: number,
  quantity: number,
  format: string,
  config: PreorderDiscountConfig,
): {
  discountPercent: number;
  pricePerBook: number;
  totalSubtotal: number;
  discountAmount: number;
} {
  const qty = Math.max(1, quantity);
  const discountPercent = config.enabled ? config.percent : 0;

  if (format === 'bundle') {
    const pricePerBook = basePrice;
    const totalSubtotal = pricePerBook * qty;
    const discountAmount =
      config.enabled && discountPercent > 0
        ? (basePrice / (1 - discountPercent / 100)) * qty - totalSubtotal
        : 0;

    return { discountPercent, pricePerBook, totalSubtotal, discountAmount };
  }

  const pricePerBook =
    config.enabled && discountPercent > 0
      ? basePrice * (1 - discountPercent / 100)
      : basePrice;
  const totalSubtotal = pricePerBook * qty;
  const discountAmount = config.enabled ? basePrice * qty - totalSubtotal : 0;

  return { discountPercent, pricePerBook, totalSubtotal, discountAmount };
}
