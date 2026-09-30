const express = require('express');
const router = express.Router();
const { getEnvironmentData, createTreeCensus } = require('../controllers/environmentController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/gardens', getEnvironmentData);
router.post('/trees', createTreeCensus);

module.exports = router;
