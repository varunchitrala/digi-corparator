const express = require('express');
const router = express.Router();
const {
  getOfficerComplaints,
  acceptComplaint,
  submitInspection,
  updateProgress,
  resolveComplaint
} = require('../controllers/officerComplaintController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('OFFICER', 'DEPARTMENT_HEAD', 'SUPER_ADMIN'));

router.get('/', getOfficerComplaints);
router.patch('/:id/accept', acceptComplaint);
router.post('/:id/inspection', submitInspection);
router.post('/:id/progress', updateProgress);
router.post('/:id/resolve', resolveComplaint);

module.exports = router;
