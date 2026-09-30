const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, getEmployeeDetails, transferEmployee } = require('../controllers/employeeController');
const { getHrDashboard } = require('../controllers/hrDashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireRole('CORPORATION_ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getHrDashboard);
router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:id', getEmployeeDetails);
router.post('/transfers', transferEmployee);

module.exports = router;
