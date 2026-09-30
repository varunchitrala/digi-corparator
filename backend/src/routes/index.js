const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const authRoutes = require('./auth');
const superAdminRoutes = require('./superAdmin');
const corporatorRoutes = require('./corporator');
const citizenComplaintRoutes = require('./citizenComplaints');
const officerComplaintRoutes = require('./officerComplaints');
const deptHeadComplaintRoutes = require('./deptHeadComplaints');
const corpAdminComplaintRoutes = require('./corpAdminComplaints');
const corpAdminWorksRoutes = require('./corpAdminWorks');
const corporatorWorksRoutes = require('./corporatorWorks');
const contractorRoutes = require('./contractors');
const corpAdminFundsRoutes = require('./corpAdminFunds');
const corporatorFundsRoutes = require('./corporatorFunds');
const citizenServicesRoutes = require('./citizenServices');
const officerApplicationsRoutes = require('./officerApplications');
const corpAdminServicesRoutes = require('./corpAdminServices');
const publicServicesRoutes = require('./publicServices');
const corpAdminGisRoutes = require('./corpAdminGis');
const corporatorGisAssetsRoutes = require('./corporatorGisAssets');
const publicGisAssetsRoutes = require('./publicGisAssets');
const corpAdminHrmsRoutes = require('./corpAdminHrms');
const hrmsAttendanceRoutes = require('./hrmsAttendance');
const corpAdminProcurementRoutes = require('./corpAdminProcurement');
const vendorPortalRoutes = require('./vendorPortal');
const publicProcurementRoutes = require('./publicProcurement');
const corpAdminRevenueRoutes = require('./corpAdminRevenue');
const citizenRevenueRoutes = require('./citizenRevenue');
const publicRevenueRoutes = require('./publicRevenue');
const corpAdminWasteRoutes = require('./corpAdminWaste');
const publicWasteRoutes = require('./publicWaste');
const corpAdminWaterRoutes = require('./corpAdminWater');
const corpAdminDrainageRoutes = require('./corpAdminDrainage');
const corpAdminSewerageRoutes = require('./corpAdminSewerage');
const publicWaterRoutes = require('./publicWater');
const corpAdminRoadsRoutes = require('./corpAdminRoads');
const publicRoadsRoutes = require('./publicRoads');
const corpAdminHealthRoutes = require('./corpAdminHealth');
const publicHealthRoutes = require('./publicHealth');
const corpAdminBpmsRoutes = require('./corpAdminBpms');
const corpAdminEstateRoutes = require('./corpAdminEstate');
const corpAdminFireRoutes = require('./corpAdminFire');
const corpAdminEnvironmentRoutes = require('./corpAdminEnvironment');
const corpAdminParkingRoutes = require('./corpAdminParking');
const corpAdminIotRoutes = require('./corpAdminIot');
const corpAdminAnalyticsRoutes = require('./corpAdminAnalytics');

const complaintRoutes = require('./complaints');
const workRoutes = require('./works');
const fundRoutes = require('./funds');
const meetingRoutes = require('./meetings');
const proposalRoutes = require('./proposals');
const aiRoutes = require('./ai');

// Mount Sub-Routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/super-admin', superAdminRoutes);
router.use('/corporator', corporatorRoutes);

// Phase 6 Complaints Sub-Routers
router.use('/citizen/complaints', citizenComplaintRoutes);
router.use('/officer/complaints', officerComplaintRoutes);
router.use('/department-head/complaints', deptHeadComplaintRoutes);
router.use('/corporation/complaints', corpAdminComplaintRoutes);

// Phase 7 Works Sub-Routers
router.use('/corporation/works', corpAdminWorksRoutes);
router.use('/corporation/contractors', contractorRoutes);
router.use('/corporator/works', corporatorWorksRoutes);

// Phase 8 Funds Sub-Routers
router.use('/corporation/finance', corpAdminFundsRoutes);
router.use('/corporator/funds', corporatorFundsRoutes);

// Phase 9 Citizen Services Sub-Routers
router.use('/citizen', citizenServicesRoutes);
router.use('/officer', officerApplicationsRoutes);
router.use('/corporation', corpAdminServicesRoutes);
router.use('/public', publicServicesRoutes);

// Phase 10 GIS & Asset Sub-Routers
router.use('/corporation', corpAdminGisRoutes);
router.use('/corporator', corporatorGisAssetsRoutes);
router.use('/public', publicGisAssetsRoutes);

// Phase 11 HRMS Sub-Routers
router.use('/corporation/hrms', corpAdminHrmsRoutes);
router.use('/hrms', hrmsAttendanceRoutes);

// Phase 12 Procurement Sub-Routers
router.use('/corporation/procurement', corpAdminProcurementRoutes);
router.use('/vendor', vendorPortalRoutes);
router.use('/public', publicProcurementRoutes);

// Phase 13 Revenue Sub-Routers
router.use('/corporation/revenue', corpAdminRevenueRoutes);
router.use('/citizen/revenue', citizenRevenueRoutes);
router.use('/public', publicRevenueRoutes);

// Phase 14 Waste Sub-Routers
router.use('/corporation/waste', corpAdminWasteRoutes);
router.use('/public/waste', publicWasteRoutes);

// Phase 15 Utility Sub-Routers
router.use('/corporation/water', corpAdminWaterRoutes);
router.use('/corporation/drainage', corpAdminDrainageRoutes);
router.use('/corporation/sewerage', corpAdminSewerageRoutes);
router.use('/public/water', publicWaterRoutes);

// Phase 16 Road Sub-Routers
router.use('/corporation/roads', corpAdminRoadsRoutes);
router.use('/public/roads', publicRoadsRoutes);

// Phase 17 Public Health Sub-Routers
router.use('/corporation/health', corpAdminHealthRoutes);
router.use('/public/health', publicHealthRoutes);

// Phases 18-24 Master Sub-Routers
router.use('/corporation/bpms', corpAdminBpmsRoutes);
router.use('/corporation/estate', corpAdminEstateRoutes);
router.use('/corporation/fire', corpAdminFireRoutes);
router.use('/corporation/environment', corpAdminEnvironmentRoutes);
router.use('/corporation/parking', corpAdminParkingRoutes);
router.use('/corporation/iot', corpAdminIotRoutes);
router.use('/corporation/analytics', corpAdminAnalyticsRoutes);

router.use('/complaints', complaintRoutes);
router.use('/works', workRoutes);
router.use('/funds', fundRoutes);
router.use('/meetings', meetingRoutes);
router.use('/proposals', proposalRoutes);
router.use('/ai', aiRoutes);

// Master API documentation route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Digital Corporator & Smart Ward Management Platform Master REST API v1.0 (Phases 1-24)',
    documentation: '/docs/api.md',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      superAdmin: '/api/super-admin',
      corporator: '/api/corporator',
      bpms: '/api/corporation/bpms/applications',
      estate: '/api/corporation/estate/properties',
      fire: '/api/corporation/fire/stations',
      environment: '/api/corporation/environment/gardens',
      parking: '/api/corporation/parking/lots',
      iot: '/api/corporation/iot/devices',
      analytics: '/api/corporation/analytics/executive'
    }
  });
});

module.exports = router;
