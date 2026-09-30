const express = require('express');
const router = express.Router();
const { getSTPs } = require('../controllers/sewerageController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/stp', getSTPs);

module.exports = router;
