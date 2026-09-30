const express = require('express');
const router = express.Router();
const { getGisLayers } = require('../controllers/gisController');
const { getAssets, createAsset, recordAssetInspection, scheduleMaintenance } = require('../controllers/assetController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/gis/layers', getGisLayers);
router.get('/assets', getAssets);
router.post('/assets', createAsset);
router.post('/assets/:id/inspection', recordAssetInspection);
router.post('/assets/:id/maintenance', scheduleMaintenance);

module.exports = router;
