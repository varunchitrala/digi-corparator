const express = require('express');
const router = express.Router();
const { getParkingData, createParkingLot } = require('../controllers/parkingController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/lots', getParkingData);
router.post('/lots', createParkingLot);

module.exports = router;
