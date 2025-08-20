const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../models/database');

// Helper function to calculate annualized cost
const calculateAnnualizedCost = (amount, frequency) => {
  switch (frequency) {
    case 'monthly':
      return amount * 12;
    case 'yearly':
      return amount;
    case 'custom':
      return amount * 12; // Assuming custom means monthly for now
    default:
      return 0;
  }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Get subscription by ID
const getSubscription = async (req, res) => {
  try {
    const subscription = await getSubscriptionById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// Create new subscription
const addSubscription = async (req, res) => {
  try {
    const { name, frequency, amount, startDate } = req.body;
    
    // Validation
    if (!name || !frequency || !amount || !startDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['monthly', 'yearly', 'custom'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency value' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const subscription = await createSubscription({ name, frequency, amount, startDate });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Update subscription
const editSubscription = async (req, res) => {
  try {
    const { name, frequency, amount, startDate } = req.body;
    const id = req.params.id;
    
    // Validation
    if (!name || !frequency || !amount || !startDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['monthly', 'yearly', 'custom'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency value' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const subscription = await updateSubscription(id, { name, frequency, amount, startDate });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Delete subscription
const removeSubscription = async (req, res) => {
  try {
    const result = await deleteSubscription(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
};

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptions();
    
    let totalYearlyCost = 0;
    
    subscriptions.forEach(sub => {
      totalYearlyCost += calculateAnnualizedCost(sub.amount, sub.frequency);
    });
    
    const averageMonthlyCost = totalYearlyCost / 12;
    
    res.json({
      totalSubscriptions: subscriptions.length,
      totalYearlyCost: Math.round(totalYearlyCost * 100) / 100,
      averageMonthlyCost: Math.round(averageMonthlyCost * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
};

module.exports = {
  getSubscriptions,
  getSubscription,
  addSubscription,
  editSubscription,
  removeSubscription,
  getStats
};
