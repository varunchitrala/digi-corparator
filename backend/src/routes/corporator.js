const express = require('express');
const router = express.Router();
const {
  getDashboardTelemetry,
  getWardOverview,
  getWardPerformance,
  getWardComplaints,
  getComplaintById,
  getComplaintMap,
  getWardWorks,
  getWorkById,
  getWardFunds,
  getWardMeetings,
  getMeetingById,
  getWardProposals,
  getProposalById,
  createWardProposal,
  getWardFollowups,
  createFollowup,
  updateFollowup,
  deleteFollowup,
  getWardDepartments,
  getWardOfficers,
  getWardGisLayers,
  getWardAssets,
  getNotifications,
  markNotificationRead,
  queryAiAssistant
} = require('../controllers/corporatorController');
const { requireAuth, requireRole, requireTenantAccess, requireCorporatorWardAccess } = require('../middleware/auth');

// Protect all Corporator routes (Require valid JWT, CORPORATOR role, tenant isolation & ward scope guard)
router.use(requireAuth);
router.use(requireRole('CORPORATOR'));
router.use(requireTenantAccess);
router.use(requireCorporatorWardAccess);

router.get('/dashboard', getDashboardTelemetry);
router.get('/ward', getWardOverview);
router.get('/ward/performance', getWardPerformance);

router.get('/complaints', getWardComplaints);
router.get('/complaints/map', getComplaintMap);
router.get('/complaints/:id', getComplaintById);

router.get('/works', getWardWorks);
router.get('/works/:id', getWorkById);

router.get('/funds', getWardFunds);

router.get('/meetings', getWardMeetings);
router.get('/meetings/:id', getMeetingById);

router.get('/proposals', getWardProposals);
router.post('/proposals', createWardProposal);
router.get('/proposals/:id', getProposalById);

router.get('/followups', getWardFollowups);
router.post('/followups', createFollowup);
router.patch('/followups/:id', updateFollowup);
router.delete('/followups/:id', deleteFollowup);

router.get('/departments', getWardDepartments);
router.get('/officers', getWardOfficers);

router.get('/gis', getWardGisLayers);
router.get('/assets', getWardAssets);

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

router.post('/ai/query', queryAiAssistant);

module.exports = router;
