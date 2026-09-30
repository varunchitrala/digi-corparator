const express = require('express');
const router = express.Router();
const { getWorks, getWorkById } = require('../controllers/workController');
const { requireAuth, requireRole, requireCorporatorWardAccess } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATOR', 'SUPER_ADMIN'));
router.use(requireCorporatorWardAccess);

router.get('/', getWorks);
router.get('/:id', getWorkById);

module.exports = router;
