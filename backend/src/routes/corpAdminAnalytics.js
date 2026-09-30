const express = require('express');
const router = express.Router();
const { getExecutiveMis } = require('../controllers/analyticsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/executive', getExecutiveMis);

module.exports = router;
