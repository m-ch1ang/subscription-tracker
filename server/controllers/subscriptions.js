const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllCategories,
  getCategoryById
} = require('../models/database');

const validateCustomFrequency = (frequency, customInterval, customIntervalUnit) => {
  if (frequency !== 'custom') {
    return null;
  }

  const interval = Number(customInterval);
  if (!Number.isInteger(interval) || interval < 1) {
    return 'Custom interval must be a positive whole number';
  }

  if (!['weeks', 'months'].includes(customIntervalUnit)) {
    return 'Custom interval unit must be weeks or months';
  }

  return null;
};

// Helper function to calculate annualized cost
const calculateAnnualizedCost = (amount, frequency, customInterval, customIntervalUnit) => {
  switch (frequency) {
    case 'monthly':
      return amount * 12;
    case 'yearly':
      return amount;
    case 'custom': {
      const interval = customInterval || 1;
      const unit = customIntervalUnit || 'months';
      if (unit === 'weeks') {
        return amount * (52 / interval);
      }
      return amount * (12 / interval);
    }
    default:
      return 0;
  }
};

// Helper function to calculate next payment date
const calculateNextPaymentDate = (startDate, frequency, customInterval, customIntervalUnit) => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextPayment = new Date(start);

  if (nextPayment >= today) {
    return nextPayment.toISOString().split('T')[0];
  }

  while (nextPayment < today) {
    if (frequency === 'monthly') {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    } else if (frequency === 'yearly') {
      nextPayment.setFullYear(nextPayment.getFullYear() + 1);
    } else if (frequency === 'custom') {
      const interval = customInterval || 1;
      const unit = customIntervalUnit || 'months';
      if (unit === 'weeks') {
        nextPayment.setDate(nextPayment.getDate() + interval * 7);
      } else {
        nextPayment.setMonth(nextPayment.getMonth() + interval);
      }
    } else {
      break;
    }
  }

  return nextPayment.toISOString().split('T')[0];
};

const withNextPaymentDate = (subscription) => ({
  ...subscription,
  nextPaymentDate: calculateNextPaymentDate(
    subscription.startDate,
    subscription.frequency,
    subscription.customInterval,
    subscription.customIntervalUnit
  )
});

// Get all subscription categories
const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await getAllSubscriptions(req.user.id);
    res.json(subscriptions.map(withNextPaymentDate));
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
    res.json(withNextPaymentDate(subscription));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// Create new subscription
const addSubscription = async (req, res) => {
  try {
    const { name, frequency, amount, startDate, categoryId, customInterval, customIntervalUnit } = req.body;

    if (!name || !frequency || !amount || !startDate || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['monthly', 'yearly', 'custom'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency value' });
    }

    const customFrequencyError = validateCustomFrequency(frequency, customInterval, customIntervalUnit);
    if (customFrequencyError) {
      return res.status(400).json({ error: customFrequencyError });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category value' });
    }

    const subscription = await createSubscription(
      { name, frequency, amount, startDate, categoryId, customInterval, customIntervalUnit },
      req.user.id
    );
    res.status(201).json(withNextPaymentDate(subscription));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Update subscription
const editSubscription = async (req, res) => {
  try {
    const { name, frequency, amount, startDate, categoryId, customInterval, customIntervalUnit } = req.body;
    const id = req.params.id;

    if (!name || !frequency || !amount || !startDate || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['monthly', 'yearly', 'custom'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency value' });
    }

    const customFrequencyError = validateCustomFrequency(frequency, customInterval, customIntervalUnit);
    if (customFrequencyError) {
      return res.status(400).json({ error: customFrequencyError });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Invalid category value' });
    }

    const subscription = await updateSubscription(
      id,
      { name, frequency, amount, startDate, categoryId, customInterval, customIntervalUnit },
      req.user.id
    );
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(withNextPaymentDate(subscription));
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
      totalYearlyCost += calculateAnnualizedCost(
        sub.amount,
        sub.frequency,
        sub.customInterval,
        sub.customIntervalUnit
      );
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
  getCategories,
  getSubscriptions,
  getSubscription,
  addSubscription,
  editSubscription,
  removeSubscription,
  getStats
};
