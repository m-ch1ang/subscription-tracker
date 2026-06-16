-- Reference table for subscription categories
CREATE TABLE IF NOT EXISTS subscription_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE subscription_categories IS 'Lookup table of subscription category options';

INSERT INTO subscription_categories (name, slug, sort_order) VALUES
  ('Streaming', 'streaming', 1),
  ('Software', 'software', 2),
  ('Fitness', 'fitness', 3),
  ('Utilities', 'utilities', 4),
  ('Gaming', 'gaming', 5),
  ('Music', 'music', 6),
  ('News & Media', 'news_media', 7),
  ('Cloud Storage', 'cloud_storage', 8),
  ('Education', 'education', 9),
  ('Productivity', 'productivity', 10),
  ('Food & Delivery', 'food_delivery', 11),
  ('Insurance', 'insurance', 12),
  ('Other', 'other', 99)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES subscription_categories(id);

UPDATE subscriptions
SET category_id = (SELECT id FROM subscription_categories WHERE slug = 'other' LIMIT 1)
WHERE category_id IS NULL;

CREATE OR REPLACE FUNCTION default_subscription_category_id()
RETURNS UUID AS $$
  SELECT id FROM subscription_categories WHERE slug = 'other' LIMIT 1;
$$ LANGUAGE sql STABLE;

ALTER TABLE subscriptions
  ALTER COLUMN category_id SET DEFAULT default_subscription_category_id(),
  ALTER COLUMN category_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_category_id ON subscriptions(category_id);
COMMENT ON COLUMN subscriptions.category_id IS 'Category of the subscription (subscription_categories.id)';
