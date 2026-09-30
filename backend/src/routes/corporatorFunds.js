const express = require('express');
const router = express.Router();
const { getCorporatorFunds } = require('../controllers/fundController');
const { requireAuth, requireRole, requireCorporatorWardAccess } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATOR', 'SUPER_ADMIN'));
router.use(requireCorporatorWardAccess);

router.get('/', getCorporatorFunds);

module.exports = router;
