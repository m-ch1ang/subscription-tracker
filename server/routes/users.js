const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Reuse a single admin client for password updates
const adminClient =
  supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

router.post('/change-password', async (req, res) => {
  if (!adminClient) {
    console.error('Missing Supabase credentials for password change');
    return res.status(500).json({ error: 'Server auth not configured' });
  }

  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const { error } = await adminClient.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

    if (error) {
      console.error('Failed to update password:', error);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
