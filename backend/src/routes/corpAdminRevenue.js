const express = require('express');
const router = express.Router();
const { getProperties, createProperty } = require('../controllers/propertyController');
const { getBills, generateTaxBill, payTaxBill } = require('../controllers/taxBillingController');
const { getWaterConnections, recordMeterReading } = require('../controllers/waterRevenueController');
const { getRevenueDashboard } = require('../controllers/revenueDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getRevenueDashboard);
router.get('/properties', getProperties);
router.post('/properties', createProperty);
router.get('/bills', getBills);
router.post('/bills/generate', generateTaxBill);
router.post('/bills/:id/pay', payTaxBill);
router.get('/water/connections', getWaterConnections);
router.post('/water/readings', recordMeterReading);

module.exports = router;
