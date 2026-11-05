-- Add DNI field to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dni TEXT;
