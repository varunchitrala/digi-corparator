const express = require('express');
const router = express.Router();
const { getEstateProperties, createEstateProperty } = require('../controllers/estateController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/properties', getEstateProperties);
router.post('/properties', createEstateProperty);

module.exports = router;
