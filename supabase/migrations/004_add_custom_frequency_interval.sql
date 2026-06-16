-- Add custom frequency interval columns for "every N weeks/months" billing
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS custom_interval INTEGER,
  ADD COLUMN IF NOT EXISTS custom_interval_unit TEXT;

ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_custom_interval_unit_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_custom_interval_unit_check
  CHECK (custom_interval_unit IS NULL OR custom_interval_unit IN ('weeks', 'months'));

ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_custom_interval_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_custom_interval_check
  CHECK (
    (frequency != 'custom' AND custom_interval IS NULL AND custom_interval_unit IS NULL)
    OR
    (frequency = 'custom' AND custom_interval IS NOT NULL AND custom_interval > 0 AND custom_interval_unit IS NOT NULL)
  );

COMMENT ON COLUMN subscriptions.custom_interval IS 'Billing interval count when frequency is custom (e.g. 2 for every 2 weeks)';
COMMENT ON COLUMN subscriptions.custom_interval_unit IS 'Billing interval unit when frequency is custom: weeks or months';
