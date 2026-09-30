const express = require('express');
const router = express.Router();
const { submitBid } = require('../controllers/bidController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/tenders/:id/bid', submitBid);

module.exports = router;
