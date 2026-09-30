const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
