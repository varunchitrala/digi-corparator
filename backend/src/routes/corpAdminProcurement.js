const express = require('express');
const router = express.Router();
const { getProcurementRequests, createProcurementRequest } = require('../controllers/procurementRequestController');
const { getTenders, createTender } = require('../controllers/tenderController');
const { getVendors, registerVendor, blacklistVendor } = require('../controllers/vendorController');
const { recordTechnicalEvaluation, openFinancialBids } = require('../controllers/evaluationController');
const { getContracts, createContract } = require('../controllers/contractController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/requests', getProcurementRequests);
router.post('/requests', createProcurementRequest);
router.get('/tenders', getTenders);
router.post('/tenders', createTender);
router.post('/tenders/:id/technical-evaluation', recordTechnicalEvaluation);
router.post('/tenders/:id/financial-opening', openFinancialBids);
router.get('/vendors', getVendors);
router.post('/vendors', registerVendor);
router.post('/vendors/:id/blacklist', blacklistVendor);
router.get('/contracts', getContracts);
router.post('/contracts', createContract);

module.exports = router;
