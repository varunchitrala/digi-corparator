const express = require('express');
const router = express.Router();
const {
  getServicesCatalog,
  getServiceDetails,
  submitApplication,
  getCitizenApplications,
  getApplicationDetails
} = require('../controllers/citizenServiceController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/services', getServicesCatalog);
router.get('/services/:id', getServiceDetails);
router.post('/services/:id/applications', submitApplication);
router.get('/applications', getCitizenApplications);
router.get('/applications/:id', getApplicationDetails);

module.exports = router;
