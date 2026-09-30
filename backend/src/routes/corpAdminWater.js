const express = require('express');
const router = express.Router();
const { getSources, createSource } = require('../controllers/waterSourceController');
const { getPipelines, createPipeline, operateValve } = require('../controllers/waterPipelineController');
const { getSchedules, createSchedule } = require('../controllers/waterSupplyScheduleController');
const { getLeakages, createLeakage } = require('../controllers/waterLeakageController');
const { getUtilityDashboard } = require('../controllers/utilityDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getUtilityDashboard);
router.get('/sources', getSources);
router.post('/sources', createSource);
router.get('/pipelines', getPipelines);
router.post('/pipelines', createPipeline);
router.post('/valves/:id/operate', operateValve);
router.get('/schedules', getSchedules);
router.post('/schedules', createSchedule);
router.get('/leakages', getLeakages);
router.post('/leakages', createLeakage);

module.exports = router;
