const express = require('express');
const router = express.Router();
const { getBpApplications, createBpApplication } = require('../controllers/bpmsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/applications', getBpApplications);
router.post('/applications', createBpApplication);

module.exports = router;
