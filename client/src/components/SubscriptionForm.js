import React, { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/helpers';
import './SubscriptionForm.css';

const SubscriptionForm = ({ subscription, categories = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'monthly',
    customInterval: '1',
    customIntervalUnit: 'months',
    amount: '',
    startDate: getTodayDate(),
    categoryId: '',
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        frequency: subscription.frequency,
        customInterval: String(subscription.customInterval || 1),
        customIntervalUnit: subscription.customIntervalUnit || 'months',
        amount: subscription.amount.toString(),
        startDate: subscription.startDate,
        categoryId: subscription.categoryId || '',
      });
    } else if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [subscription, categories]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.frequency === 'custom') {
      const interval = parseInt(formData.customInterval, 10);
      if (!Number.isInteger(interval) || interval < 1) {
        newErrors.customInterval = 'Interval must be a positive whole number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const isCustom = formData.frequency === 'custom';
      onSubmit({
        name: formData.name,
        frequency: formData.frequency,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        categoryId: formData.categoryId,
        customInterval: isCustom ? parseInt(formData.customInterval, 10) : null,
        customIntervalUnit: isCustom ? formData.customIntervalUnit : null,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{subscription ? 'Edit Subscription' : 'Add New Subscription'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-group">
            <label htmlFor="name">Subscription Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frequency *</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {formData.frequency === 'custom' && (
            <div className="form-group custom-interval-group">
              <label>Custom billing cycle *</label>
              <div className="custom-interval-row">
                <span className="custom-interval-prefix">Every</span>
                <input
                  type="number"
                  id="customInterval"
                  name="customInterval"
                  value={formData.customInterval}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={errors.customInterval ? 'error' : ''}
                  aria-label="Custom interval count"
                />
                <select
                  id="customIntervalUnit"
                  name="customIntervalUnit"
                  value={formData.customIntervalUnit}
                  onChange={handleChange}
                  aria-label="Custom interval unit"
                >
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </select>
              </div>
              {errors.customInterval && <span className="error-text">{errors.customInterval}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-text">{errors.startDate}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {subscription ? 'Update' : 'Add'} Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;
