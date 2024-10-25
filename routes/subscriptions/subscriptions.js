const router = require('express').Router();
const { authenticate } = require('../../middleware/authentication');
const {
  createSession,
  webhooks,
  createSubscription,
  cancelSubscription,
  all_subscription_user
} = require('../../controllers/subscriptions/subscriptions');
router.post('/create-session', authenticate, createSession);
router.post('/webhooks', webhooks);
router.post('/create-subscription', authenticate, createSubscription);
router.post('/cancel-subscription', authenticate, cancelSubscription);
router.get('/subscription-users', all_subscription_user)

module.exports = router;
