const express = require('express');
const router = express.Router();
const { getDrains } = require('../controllers/drainageController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/drains', getDrains);

module.exports = router;
