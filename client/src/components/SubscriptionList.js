import React, { useMemo, useState } from 'react';
import {
  formatCurrency,
  formatDate,
  formatFrequencyLabel,
  calculateAnnualizedCostForSubscription,
  filterSubscriptions,
  isDueThisWeek,
} from '../utils/helpers';
import './SubscriptionList.css';

const DEFAULT_FILTERS = {
  searchQuery: '',
  frequency: 'all',
  categoryId: 'all',
  dueThisWeek: false,
};

const SubscriptionList = ({ subscriptions, categories = [], onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.frequency !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.dueThisWeek;

  const filteredSubscriptions = useMemo(
    () => filterSubscriptions(subscriptions, filters),
    [subscriptions, filters]
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedSubscriptions = useMemo(() => {
    return [...filteredSubscriptions].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'amount') {
        aValue = calculateAnnualizedCostForSubscription(a);
        bValue = calculateAnnualizedCostForSubscription(b);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  }, [filteredSubscriptions, sortBy, sortOrder]);

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

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
      <div className="list-header">
        <h2>📋 Your Subscriptions</h2>
        {hasActiveFilters && (
          <span className="result-count">
            {filteredSubscriptions.length} of {subscriptions.length}
          </span>
        )}
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name or category..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            aria-label="Search subscriptions"
          />
        </div>

        <div className="filter-groups">
          <div className="filter-group">
            <span className="filter-label">Frequency</span>
            <div className="filter-buttons">
              {[
                { value: 'all', label: 'All' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'custom', label: 'Custom' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  className={`filter-btn ${filters.frequency === value ? 'active' : ''}`}
                  onClick={() => updateFilter('frequency', value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Category</span>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filters.categoryId === 'all' ? 'active' : ''}`}
                  onClick={() => updateFilter('categoryId', 'all')}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`filter-btn ${filters.categoryId === category.id ? 'active' : ''}`}
                    onClick={() => updateFilter('categoryId', category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-group">
            <span className="filter-label">Due date</span>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!filters.dueThisWeek ? 'active' : ''}`}
                onClick={() => updateFilter('dueThisWeek', false)}
              >
                All
              </button>
              <button
                className={`filter-btn due-week ${filters.dueThisWeek ? 'active' : ''}`}
                onClick={() => updateFilter('dueThisWeek', true)}
              >
                Due this week
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

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
            className={`sort-btn ${sortBy === 'categoryName' ? 'active' : ''}`}
            onClick={() => handleSort('categoryName')}
          >
            Category {getSortIcon('categoryName')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'frequency' ? 'active' : ''}`}
            onClick={() => handleSort('frequency')}
          >
            Frequency {getSortIcon('frequency')}
          </button>
        </div>
      </div>

      {sortedSubscriptions.length === 0 ? (
        <div className="empty-state">
          <p>No subscriptions match your filters.</p>
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {sortedSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`subscription-card ${isDueThisWeek(subscription.nextPaymentDate) ? 'due-soon' : ''}`}
            >
              <div className="subscription-header">
                <div className="subscription-title">
                  <h3 className="subscription-name">{subscription.name}</h3>
                  {subscription.categoryName && (
                    <span className="category-badge">{subscription.categoryName}</span>
                  )}
                </div>
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
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{subscription.categoryName || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Frequency:</span>
                  <span className="detail-value">{formatFrequencyLabel(subscription)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">{formatDate(subscription.startDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Next Payment:</span>
                  <span className="detail-value">
                    {subscription.nextPaymentDate ? formatDate(subscription.nextPaymentDate) : 'N/A'}
                    {isDueThisWeek(subscription.nextPaymentDate) && (
                      <span className="due-badge">Due soon</span>
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Yearly Cost:</span>
                  <span className="detail-value cost-highlight">
                    {formatCurrency(calculateAnnualizedCostForSubscription(subscription))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
