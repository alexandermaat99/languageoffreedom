-- Add signing_names column to orders table
-- This column will store an array of names for personalized book signing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS signing_names TEXT[];

-- Add an index for queries filtering by signing names
CREATE INDEX IF NOT EXISTS idx_orders_signing_names ON orders USING GIN(signing_names);

-- DROP required: CREATE OR REPLACE cannot insert columns before existing ones
DROP VIEW IF EXISTS completed_orders;
CREATE VIEW completed_orders AS
SELECT 
    id,
    email,
    name,
    book_format,
    quantity,
    signing_names,
    amount,
    book_title,
    shipping_first_name,
    shipping_last_name,
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_state,
    shipping_postal_code,
    shipping_country,
    shipping_phone,
    shipping_status,
    tracking_number,
    shipped_at,
    delivered_at,
    created_at,
    payment_completed_at
FROM orders 
WHERE status = 'completed'
ORDER BY payment_completed_at DESC;

DROP VIEW IF EXISTS orders_to_ship;
CREATE VIEW orders_to_ship AS
SELECT 
    id,
    email,
    name,
    book_format,
    quantity,
    signing_names,
    book_title,
    shipping_first_name,
    shipping_last_name,
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_state,
    shipping_postal_code,
    shipping_country,
    shipping_phone,
    payment_completed_at
FROM orders 
WHERE status = 'completed' 
  AND shipping_status = 'not_shipped'
ORDER BY payment_completed_at ASC;
