const express = require('express');
const router = express.Router();
const {
  createCitizenComplaint,
  getCitizenComplaints,
  getCitizenComplaintById,
  verifyResolution,
  reopenComplaint,
  submitFeedback
} = require('../controllers/citizenComplaintController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CITIZEN', 'SUPER_ADMIN', 'CORPORATOR'));

router.post('/', createCitizenComplaint);
router.get('/', getCitizenComplaints);
router.get('/:id', getCitizenComplaintById);
router.post('/:id/verify', verifyResolution);
router.post('/:id/reopen', reopenComplaint);
router.post('/:id/feedback', submitFeedback);

module.exports = router;
