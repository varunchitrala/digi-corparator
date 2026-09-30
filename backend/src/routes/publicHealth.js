const express = require('express');
const router = express.Router();
const { getPublicHealthFacilities } = require('../controllers/healthDashboardController');

router.get('/facilities', getPublicHealthFacilities);

module.exports = router;
