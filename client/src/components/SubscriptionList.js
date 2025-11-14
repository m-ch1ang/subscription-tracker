import React, { useState } from 'react';
import { formatCurrency, formatDate, frequencyLabels, calculateAnnualizedCost } from '../utils/helpers';
import './SubscriptionList.css';

const SubscriptionList = ({ subscriptions, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Special handling for amount sorting (use annualized cost)
    if (sortBy === 'amount') {
      aValue = calculateAnnualizedCost(a.amount, a.frequency);
      bValue = calculateAnnualizedCost(b.amount, b.frequency);
    }

    // Convert to comparable values
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (subscriptions.length === 0) {
    return (
      <div className="subscription-list">
        <h2>📋 Your Subscriptions</h2>
        <div className="empty-state">
          <p>No subscriptions found. Add your first subscription to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-list">
      <h2>📋 Your Subscriptions</h2>
      
      <div className="list-controls">
        <div className="sort-buttons">
          <span>Sort by:</span>
          <button
            className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name {getSortIcon('name')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'amount' ? 'active' : ''}`}
            onClick={() => handleSort('amount')}
          >
            Amount {getSortIcon('amount')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'frequency' ? 'active' : ''}`}
            onClick={() => handleSort('frequency')}
          >
            Frequency {getSortIcon('frequency')}
          </button>
        </div>
      </div>

      <div className="subscriptions-grid">
        {sortedSubscriptions.map((subscription) => (
          <div key={subscription.id} className="subscription-card">
            <div className="subscription-header">
              <h3 className="subscription-name">{subscription.name}</h3>
              <div className="subscription-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(subscription)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(subscription.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="subscription-details">
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">{formatCurrency(subscription.amount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Frequency:</span>
                <span className="detail-value">{frequencyLabels[subscription.frequency]}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">{formatDate(subscription.startDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Next Payment:</span>
                <span className="detail-value">
                  {subscription.nextPaymentDate ? formatDate(subscription.nextPaymentDate) : 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Yearly Cost:</span>
                <span className="detail-value cost-highlight">
                  {formatCurrency(calculateAnnualizedCost(subscription.amount, subscription.frequency))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;
