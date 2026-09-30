const express = require('express');
const router = express.Router();
const {
  getOfficerApplications,
  verifyDocument,
  requestClarification,
  recordInspection,
  approveApplication
} = require('../controllers/officerApplicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('OFFICER', 'DEPARTMENT_HEAD', 'SUPER_ADMIN'));

router.get('/applications', getOfficerApplications);
router.post('/applications/:id/verify-document', verifyDocument);
router.post('/applications/:id/clarification', requestClarification);
router.post('/applications/:id/inspection', recordInspection);
router.post('/applications/:id/approve', approveApplication);

module.exports = router;
