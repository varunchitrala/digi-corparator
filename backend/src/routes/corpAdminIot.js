const express = require('express');
const router = express.Router();
const { getIotDevices, createIotDevice } = require('../controllers/iotController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/devices', getIotDevices);
router.post('/devices', createIotDevice);

module.exports = router;
