const express = require('express');
const router = express.Router();
const { getGisLayers } = require('../controllers/gisController');
const { getAssets } = require('../controllers/assetController');
const { requireAuth, requireRole, requireCorporatorWardAccess } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATOR', 'SUPER_ADMIN'));
router.use(requireCorporatorWardAccess);

router.get('/gis', getGisLayers);
router.get('/assets', getAssets);

module.exports = router;
