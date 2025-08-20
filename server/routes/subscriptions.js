const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getSubscription,
  addSubscription,
  editSubscription,
  removeSubscription,
  getStats
} = require('../controllers/subscriptions');

// GET /api/subscriptions - Get all subscriptions
router.get('/', getSubscriptions);

// GET /api/subscriptions/stats - Get dashboard statistics
router.get('/stats', getStats);

// GET /api/subscriptions/:id - Get subscription by ID
router.get('/:id', getSubscription);

// POST /api/subscriptions - Create new subscription
router.post('/', addSubscription);

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', editSubscription);

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', removeSubscription);

module.exports = router;
