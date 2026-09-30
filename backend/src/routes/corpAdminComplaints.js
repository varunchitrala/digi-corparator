const express = require('express');
const router = express.Router();
const {
  getCorpAdminComplaints,
  getComplaintAnalytics,
  getCorpComplaintMap
} = require('../controllers/corpAdminComplaintController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/', getCorpAdminComplaints);
router.get('/analytics', getComplaintAnalytics);
router.get('/map', getCorpComplaintMap);

module.exports = router;
