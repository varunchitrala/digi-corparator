const express = require('express');
const router = express.Router();
const { getAttendanceRegister, processCheckIn } = require('../controllers/attendanceController');
const { getLeaveApplications, applyLeave, approveLeave } = require('../controllers/leaveController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/attendance', getAttendanceRegister);
router.post('/attendance/check-in', processCheckIn);
router.get('/leave/applications', getLeaveApplications);
router.post('/leave/apply', applyLeave);
router.post('/leave/applications/:id/approve', approveLeave);

module.exports = router;
