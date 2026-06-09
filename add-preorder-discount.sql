-- Add preorder_discount to site_config
-- Allows admin to enable/disable checkout discount and set the percentage

INSERT INTO public.site_config (config_key, config_value, description, category)
VALUES (
  'preorder_discount',
  '{"enabled": true, "percent": 15}'::jsonb,
  'Preorder checkout discount. Toggle on/off and set the percentage off the list price.',
  'preorder'
)
ON CONFLICT (config_key) DO UPDATE
SET
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = now();
