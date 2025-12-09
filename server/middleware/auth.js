const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const authClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceKey || 'placeholder-key'
);

const requireAuth = async (req, res, next) => {
  try {
    if (!supabaseUrl || !serviceKey) {
      console.error('Missing Supabase URL or service role key for auth');
      return res.status(500).json({ error: 'Server auth not configured' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = data.user;

    // Ensure profile exists in public.users (id/email mirror)
    const { error: upsertError } = await authClient
      .from('users')
      .upsert({ id: user.id, email: user.email })
      .select('id')
      .single();

    if (upsertError) {
      console.error('Failed to upsert user profile:', upsertError);
      return res.status(500).json({ error: 'Failed to sync user profile' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { requireAuth };
