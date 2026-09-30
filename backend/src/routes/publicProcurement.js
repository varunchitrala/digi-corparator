const express = require('express');
const router = express.Router();
const { getPublicTenders } = require('../controllers/publicProcurementController');

router.get('/tenders', getPublicTenders);

module.exports = router;
