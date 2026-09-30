const express = require('express');
const router = express.Router();
const { getContractors, getContractorById, createContractor } = require('../controllers/contractorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/', getContractors);
router.post('/', createContractor);
router.get('/:id', getContractorById);

module.exports = router;
