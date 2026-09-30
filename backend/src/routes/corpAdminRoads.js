const express = require('express');
const router = express.Router();
const { getRoads, createRoad } = require('../controllers/roadController');
const { getPotholes, createPothole } = require('../controllers/potholeController');
const { getRepairs, createRepair } = require('../controllers/roadRepairController');
const { getCuttingApplications, createCuttingApplication, approveCuttingApplication } = require('../controllers/roadCuttingController');
const { getFootpaths } = require('../controllers/footpathController');
const { getRoadDashboard } = require('../controllers/roadDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getRoadDashboard);
router.get('/', getRoads);
router.post('/', createRoad);
router.get('/potholes', getPotholes);
router.post('/potholes', createPothole);
router.get('/repairs', getRepairs);
router.post('/repairs', createRepair);
router.get('/cutting', getCuttingApplications);
router.post('/cutting', createCuttingApplication);
router.post('/cutting/:id/approve', approveCuttingApplication);
router.get('/footpaths', getFootpaths);

module.exports = router;
