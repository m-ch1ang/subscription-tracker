import React, { useMemo } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = ({ stats, subscriptions = [] }) => {
  const { totalSubscriptions = 0, totalYearlyCost = 0, averageMonthlyCost = 0 } = stats;

  // Calculate upcoming payments
  const upcomingPayments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return subscriptions
      .filter(sub => sub.nextPaymentDate)
      .map(sub => ({
        ...sub,
        nextPaymentDateObj: new Date(sub.nextPaymentDate)
      }))
      .filter(sub => sub.nextPaymentDateObj >= today)
      .sort((a, b) => a.nextPaymentDateObj - b.nextPaymentDateObj)
      .slice(0, 10); // Show next 10 upcoming payments
  }, [subscriptions]);

  return (
    <div className="dashboard">
      <h2>📊 Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalSubscriptions}</div>
          <div className="stat-label">Active Subscriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(totalYearlyCost)}</div>
          <div className="stat-label">Total Yearly Cost</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(averageMonthlyCost)}</div>
          <div className="stat-label">Average Monthly Cost</div>
        </div>
      </div>

      {upcomingPayments.length > 0 && (
        <div className="upcoming-payments-section">
          <h3>📅 Upcoming Payments</h3>
          <div className="upcoming-payments-list">
            {upcomingPayments.map((subscription) => {
              const daysUntil = Math.ceil(
                (subscription.nextPaymentDateObj - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isSoon = daysUntil <= 7;
              
              return (
                <div
                  key={subscription.id}
                  className={`upcoming-payment-item ${isSoon ? 'soon' : ''}`}
                >
                  <div className="payment-info">
                    <div className="payment-name">{subscription.name}</div>
                    <div className="payment-date">
                      {formatDate(subscription.nextPaymentDate)}
                      {daysUntil === 0 && <span className="badge today">Today</span>}
                      {daysUntil === 1 && <span className="badge tomorrow">Tomorrow</span>}
                      {daysUntil > 1 && daysUntil <= 7 && (
                        <span className="badge soon">{daysUntil} days</span>
                      )}
                    </div>
                  </div>
                  <div className="payment-amount">{formatCurrency(subscription.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
