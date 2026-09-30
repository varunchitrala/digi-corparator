const express = require('express');
const router = express.Router();
const { getPublicRoadMap } = require('../controllers/roadDashboardController');

router.get('/map', getPublicRoadMap);

module.exports = router;
