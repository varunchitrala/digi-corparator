const express = require('express');
const router = express.Router();
const {
  getWorks,
  getWorkById,
  createWork,
  submitApproval,
  issueWorkOrder,
  addMilestones,
  updateProgress,
  submitBill
} = require('../controllers/workController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/', getWorks);
router.post('/', createWork);
router.get('/:id', getWorkById);
router.post('/:id/approve', submitApproval);
router.post('/:id/work-order', issueWorkOrder);
router.post('/:id/milestones', addMilestones);
router.post('/:id/progress', updateProgress);
router.post('/:id/bills', submitBill);

module.exports = router;
