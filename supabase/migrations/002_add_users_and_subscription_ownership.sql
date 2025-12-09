-- Create users table mapped to Supabase Auth users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Application user profiles mapped to Supabase Auth users';
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));

-- Keep updated_at in sync
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Remove legacy subscriptions without owners
DELETE FROM subscriptions;

-- Tie subscriptions to owning user
ALTER TABLE subscriptions
  ADD COLUMN user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
COMMENT ON COLUMN subscriptions.user_id IS 'Owner of the subscription (users.id)';
