const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Create client with fallback empty strings to prevent crashes
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Helper function to transform snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return null;
  return {
    id: obj.id,
    name: obj.name,
    frequency: obj.frequency,
    amount: parseFloat(obj.amount),
    startDate: obj.start_date,
    userId: obj.user_id,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at
  };
};

// Helper function to transform camelCase to snake_case
const toSnakeCase = (obj) => {
  return {
    name: obj.name,
    frequency: obj.frequency,
    amount: obj.amount,
    start_date: obj.startDate,
    user_id: obj.userId
  };
};

const initializeDatabase = async () => {
  // Check if environment variables are set
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in your .env file');
    throw new Error('Missing Supabase environment variables');
  }

  try {
    // Test connection by querying the subscriptions table
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message);
      console.error('Make sure you have run the migration SQL in your Supabase project');
      throw error;
    }
    
    console.log('✅ Connected to Supabase successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

const getAllSubscriptions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(toCamelCase);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

const getSubscriptionById = async (id, userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }
    
    return toCamelCase(data);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

const createSubscription = async (subscription, userId) => {
  try {
    const subscriptionData = toSnakeCase({ ...subscription, userId });
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return toCamelCase(data);
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

const updateSubscription = async (id, subscription, userId) => {
  try {
    const subscriptionData = toSnakeCase({ ...subscription, userId });
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return toCamelCase(data);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

const deleteSubscription = async (id, userId) => {
  try {
    const { error, count } = await supabase
      .from('subscriptions')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return { deletedCount: count || 0 };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
