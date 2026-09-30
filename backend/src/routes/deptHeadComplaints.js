const express = require('express');
const router = express.Router();
const {
  getDeptHeadComplaints,
  assignOfficer,
  escalateComplaint
} = require('../controllers/deptHeadComplaintController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('DEPARTMENT_HEAD', 'CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/', getDeptHeadComplaints);
router.post('/:id/assign', assignOfficer);
router.post('/:id/reassign', assignOfficer);
router.post('/:id/escalate', escalateComplaint);

module.exports = router;
