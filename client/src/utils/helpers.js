// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Frequency display mapping
export const frequencyLabels = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  custom: 'Custom',
};

export const formatFrequencyLabel = ({ frequency, customInterval, customIntervalUnit }) => {
  if (frequency === 'custom') {
    const interval = customInterval || 1;
    const unit = customIntervalUnit || 'months';
    const unitLabel = interval === 1
      ? (unit === 'weeks' ? 'week' : 'month')
      : unit;
    return `Every ${interval} ${unitLabel}`;
  }

  return frequencyLabels[frequency] || frequency;
};

// Calculate annualized cost
export const calculateAnnualizedCost = (amount, frequency, customInterval, customIntervalUnit) => {
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

export const calculateAnnualizedCostForSubscription = (subscription) =>
  calculateAnnualizedCost(
    subscription.amount,
    subscription.frequency,
    subscription.customInterval,
    subscription.customIntervalUnit
  );

// Calculate next payment date (for frontend use if needed)
export const calculateNextPaymentDate = (startDate, frequency, customInterval, customIntervalUnit) => {
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

export const calculateNextPaymentDateForSubscription = (subscription) =>
  calculateNextPaymentDate(
    subscription.startDate,
    subscription.frequency,
    subscription.customInterval,
    subscription.customIntervalUnit
  );
