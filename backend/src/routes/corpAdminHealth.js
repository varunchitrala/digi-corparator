const express = require('express');
const router = express.Router();
const { getFacilities, createFacility } = require('../controllers/healthFacilityController');
const { getCamps, createCamp } = require('../controllers/healthServiceController');
const { getVisits } = require('../controllers/healthVisitController');
const { getSurveillance, createSurveillance } = require('../controllers/diseaseSurveillanceController');
const { getFogging, createFogging } = require('../controllers/vectorControlController');
const { getFoodInspections, createFoodInspection } = require('../controllers/foodHygieneController');
const { getHealthDashboard } = require('../controllers/healthDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getHealthDashboard);
router.get('/facilities', getFacilities);
router.post('/facilities', createFacility);
router.get('/camps', getCamps);
router.post('/camps', createCamp);
router.get('/visits', getVisits);
router.get('/surveillance', getSurveillance);
router.post('/surveillance', createSurveillance);
router.get('/fogging', getFogging);
router.post('/fogging', createFogging);
router.get('/inspections', getFoodInspections);
router.post('/inspections', createFoodInspection);

module.exports = router;
