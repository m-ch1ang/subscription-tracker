import React, { useState, useEffect } from 'react';
import { getTodayDate } from '../utils/helpers';
import './SubscriptionForm.css';

const SubscriptionForm = ({ subscription, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'monthly',
    amount: '',
    startDate: getTodayDate(),
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        frequency: subscription.frequency,
        amount: subscription.amount.toString(),
        startDate: subscription.startDate,
      });
    }
  }, [subscription]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
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
