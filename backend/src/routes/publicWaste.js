const express = require('express');
const router = express.Router();
const { getPublicBinTelemetry } = require('../controllers/wasteBinController');

router.get('/bin/:binCode', getPublicBinTelemetry);

module.exports = router;
