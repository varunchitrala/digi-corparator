const express = require('express');
const router = express.Router();
const { getFireStations, createFireNoc } = require('../controllers/fireController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/stations', getFireStations);
router.post('/noc', createFireNoc);

module.exports = router;
