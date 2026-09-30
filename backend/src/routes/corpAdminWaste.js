const express = require('express');
const router = express.Router();
const { getHouseholds, createHousehold } = require('../controllers/wasteHouseholdController');
const { getRoutes, createRoute } = require('../controllers/wasteRouteController');
const { getCollections, recordCollection } = require('../controllers/doorToDoorCollectionController');
const { getBins } = require('../controllers/wasteBinController');
const { getWeighments, recordWeighment } = require('../controllers/wasteWeighmentController');
const { getWasteDashboard } = require('../controllers/wasteDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getWasteDashboard);
router.get('/households', getHouseholds);
router.post('/households', createHousehold);
router.get('/routes', getRoutes);
router.post('/routes', createRoute);
router.get('/collections', getCollections);
router.post('/collections', recordCollection);
router.get('/bins', getBins);
router.get('/weighment', getWeighments);
router.post('/weighment', recordWeighment);

module.exports = router;
