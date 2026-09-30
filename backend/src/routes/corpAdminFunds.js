const express = require('express');
const router = express.Router();
const {
  getFinancialYears,
  getBudgets,
  allocateFunds,
  createExpenditure,
  processPayment
} = require('../controllers/fundController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/financial-years', getFinancialYears);
router.get('/budgets', getBudgets);
router.post('/funds/allocate', allocateFunds);
router.post('/expenditure', createExpenditure);
router.post('/payments', processPayment);

module.exports = router;
