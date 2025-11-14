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

// Calculate annualized cost
export const calculateAnnualizedCost = (amount, frequency) => {
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

// Frequency display mapping
export const frequencyLabels = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  custom: 'Custom',
};

// Calculate next payment date (for frontend use if needed)
export const calculateNextPaymentDate = (startDate, frequency) => {
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
