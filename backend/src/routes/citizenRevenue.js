const express = require('express');
const router = express.Router();
const { generateTaxClearance } = require('../controllers/taxClearanceController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/clearance/generate', generateTaxClearance);

module.exports = router;
