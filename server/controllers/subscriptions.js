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

// Helper function to calculate next payment date
const calculateNextPaymentDate = (startDate, frequency) => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
  
  let nextPayment = new Date(start);
  
  // If start date is in the future, that's the next payment
  if (nextPayment >= today) {
    return nextPayment.toISOString().split('T')[0];
  }
  
  // Calculate next payment based on frequency
  while (nextPayment < today) {
    if (frequency === 'monthly' || frequency === 'custom') {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    } else if (frequency === 'yearly') {
      nextPayment.setFullYear(nextPayment.getFullYear() + 1);
    } else {
      break; // Unknown frequency
    }
  }
  
  return nextPayment.toISOString().split('T')[0];
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptions(req.user.id);
    // Add nextPaymentDate to each subscription
    const subscriptionsWithNextPayment = subscriptions.map(sub => ({
      ...sub,
      nextPaymentDate: calculateNextPaymentDate(sub.startDate, sub.frequency)
    }));
    res.json(subscriptionsWithNextPayment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Get subscription by ID
const getSubscription = async (req, res) => {
  try {
    const subscription = await getSubscriptionById(req.params.id, req.user.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    // Add nextPaymentDate to subscription
    const subscriptionWithNextPayment = {
      ...subscription,
      nextPaymentDate: calculateNextPaymentDate(subscription.startDate, subscription.frequency)
    };
    res.json(subscriptionWithNextPayment);
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

    const subscription = await createSubscription({ name, frequency, amount, startDate }, req.user.id);
    // Add nextPaymentDate to response
    const subscriptionWithNextPayment = {
      ...subscription,
      nextPaymentDate: calculateNextPaymentDate(startDate, frequency)
    };
    res.status(201).json(subscriptionWithNextPayment);
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

    const subscription = await updateSubscription(id, { name, frequency, amount, startDate }, req.user.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    // Add nextPaymentDate to response
    const subscriptionWithNextPayment = {
      ...subscription,
      nextPaymentDate: calculateNextPaymentDate(startDate, frequency)
    };
    res.json(subscriptionWithNextPayment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Delete subscription
const removeSubscription = async (req, res) => {
  try {
    const result = await deleteSubscription(req.params.id, req.user.id);
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
    const subscriptions = await getAllSubscriptions(req.user.id);
    
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
