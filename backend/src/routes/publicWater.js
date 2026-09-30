const express = require('express');
const router = express.Router();
const { getPublicSchedule } = require('../controllers/waterSupplyScheduleController');

router.get('/schedule', getPublicSchedule);

module.exports = router;
