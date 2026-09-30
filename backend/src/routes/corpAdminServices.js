const express = require('express');
const router = express.Router();
const { getAdminServices, addDynamicField } = require('../controllers/corpAdminServiceController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/services', getAdminServices);
router.post('/services/:id/fields', addDynamicField);

module.exports = router;
