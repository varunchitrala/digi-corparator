const express = require('express');
const router = express.Router();
const { getPublicTaxClearance } = require('../controllers/taxClearanceController');

router.get('/clearance/:certificateNumber', getPublicTaxClearance);

module.exports = router;
