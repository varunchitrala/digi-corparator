const express = require('express');
const router = express.Router();
const {
  getDashboardTelemetry,
  getCorporations,
  getCorporationById,
  createCorporationWizard,
  updateCorporationStatus,
  getPlans,
  createPlan,
  getSubscriptions,
  getUsers,
  getRoles,
  getModules,
  getSlaRules,
  saveSlaRule,
  getSystemSettings,
  getAuditLogs
} = require('../controllers/superAdminController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Protect all Super Admin routes (Require valid JWT & SUPER_ADMIN role)
router.use(requireAuth);
router.use(requireRole('SUPER_ADMIN'));

router.get('/dashboard', getDashboardTelemetry);
router.get('/corporations', getCorporations);
router.get('/corporations/:id', getCorporationById);
router.post('/corporations', createCorporationWizard);
router.patch('/corporations/:id/status', updateCorporationStatus);

router.get('/plans', getPlans);
router.post('/plans', createPlan);

router.get('/subscriptions', getSubscriptions);
router.get('/users', getUsers);
router.get('/roles', getRoles);
router.get('/modules', getModules);
router.get('/settings', getSystemSettings);

router.get('/master-data/sla', getSlaRules);
router.post('/master-data/sla', saveSlaRule);

router.get('/audit-logs', getAuditLogs);

module.exports = router;
