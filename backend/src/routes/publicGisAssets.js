const express = require('express');
const router = express.Router();
const { getPublicAssetDetails } = require('../controllers/assetController');

router.get('/assets/:assetCode', getPublicAssetDetails);

module.exports = router;
