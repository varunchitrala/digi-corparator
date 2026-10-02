import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';
import { CorporatorLayout } from './layouts/CorporatorLayout';
import { CitizenLayout } from './layouts/CitizenLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { WorksPage } from './pages/WorksPage';
import { FundsPage } from './pages/FundsPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { ProposalsPage } from './pages/ProposalsPage';
import { GisPage } from './pages/GisPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Super Admin Pages
import { SuperAdminDashboardPage } from './pages/superAdmin/SuperAdminDashboardPage';
import { CorporationsPage } from './pages/superAdmin/CorporationsPage';
import { CreateCorporationWizardPage } from './pages/superAdmin/CreateCorporationWizardPage';
import { CorporationDetailsPage } from './pages/superAdmin/CorporationDetailsPage';
import { PlansPage } from './pages/superAdmin/PlansPage';
import { SubscriptionsPage } from './pages/superAdmin/SubscriptionsPage';
import { SuperAdminUsersPage } from './pages/superAdmin/SuperAdminUsersPage';
import { SuperAdminRolesPage } from './pages/superAdmin/SuperAdminRolesPage';
import { SuperAdminModulesPage } from './pages/superAdmin/SuperAdminModulesPage';
import { SuperAdminMasterDataPage } from './pages/superAdmin/SuperAdminMasterDataPage';
import { SuperAdminNotificationsPage } from './pages/superAdmin/SuperAdminNotificationsPage';
import { SuperAdminApiManagementPage } from './pages/superAdmin/SuperAdminApiManagementPage';
import { SuperAdminGisPage } from './pages/superAdmin/SuperAdminGisPage';
import { SuperAdminReportsPage } from './pages/superAdmin/SuperAdminReportsPage';
import { AuditLogsPage } from './pages/superAdmin/AuditLogsPage';
import { SuperAdminSecurityPage } from './pages/superAdmin/SuperAdminSecurityPage';
import { SuperAdminSettingsPage } from './pages/superAdmin/SuperAdminSettingsPage';

// Corporator & Ward Admin Pages
import { CorporatorDashboardPage } from './pages/corporator/CorporatorDashboardPage';
import { WardOverviewPage } from './pages/corporator/WardOverviewPage';
import { CorporatorComplaintsPage } from './pages/corporator/CorporatorComplaintsPage';
import { ComplaintDetailsPage } from './pages/corporator/ComplaintDetailsPage';
import { ComplaintMapPage } from './pages/corporator/ComplaintMapPage';
import { CorporatorWorksPage } from './pages/corporator/CorporatorWorksPage';
import { WorkDetailsPage } from './pages/corporator/WorkDetailsPage';
import { CorporatorFundsPage } from './pages/corporator/CorporatorFundsPage';
import { CorporatorMeetingsPage } from './pages/corporator/CorporatorMeetingsPage';
import { CorporatorProposalsPage } from './pages/corporator/CorporatorProposalsPage';
import { CorporatorFollowupsPage } from './pages/corporator/CorporatorFollowupsPage';
import { CorporatorDepartmentsPage } from './pages/corporator/CorporatorDepartmentsPage';
import { CorporatorOfficersPage } from './pages/corporator/CorporatorOfficersPage';
import { CorporatorGisPage } from './pages/corporator/CorporatorGisPage';
import { CorporatorAssetsPage } from './pages/corporator/CorporatorAssetsPage';
import { CorporatorNotificationsPage } from './pages/corporator/CorporatorNotificationsPage';
import { CorporatorDocumentsPage } from './pages/corporator/CorporatorDocumentsPage';
import { CorporatorReportsPage } from './pages/corporator/CorporatorReportsPage';
import { CorporatorProfilePage } from './pages/corporator/CorporatorProfilePage';
import { CorporatorAiPage } from './pages/corporator/CorporatorAiPage';
import { CorporatorSmartWardPage } from './pages/gis/CorporatorSmartWardPage';

// Dedicated Role Dashboards
import { WardAdminDashboardPage } from './pages/wardAdmin/WardAdminDashboardPage';
import { DeptHeadDashboardPage } from './pages/departmentHead/DeptHeadDashboardPage';
import { OfficerDashboardPage } from './pages/officer/OfficerDashboardPage';
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage';
import { ContractorDashboardPage } from './pages/contractor/ContractorDashboardPage';

// Phase 6 Complaints Pages
import { CitizenComplaintsPage } from './pages/complaints/CitizenComplaintsPage';
import { CreateComplaintWizardPage } from './pages/complaints/CreateComplaintWizardPage';
import { CitizenComplaintDetailsPage } from './pages/complaints/CitizenComplaintDetailsPage';
import { OfficerComplaintsPage } from './pages/complaints/OfficerComplaintsPage';
import { CorpAdminComplaintsPage } from './pages/complaints/CorpAdminComplaintsPage';
import { ComplaintAnalyticsPage } from './pages/complaints/ComplaintAnalyticsPage';

// Phase 7 Development Works Pages
import { CorpWorksPage } from './pages/works/CorpWorksPage';
import { CorpWorksDashboardPage } from './pages/works/CorpWorksDashboardPage';
import { CreateWorkWizardPage } from './pages/works/CreateWorkWizardPage';
import { ContractorsPage } from './pages/works/ContractorsPage';

// Phase 8 Financial Pages
import { CorpBudgetPage } from './pages/funds/CorpBudgetPage';
import { CorpFundsPage } from './pages/funds/CorpFundsPage';
import { CorpExpenditurePage } from './pages/funds/CorpExpenditurePage';
import { CorpPaymentsPage } from './pages/funds/CorpPaymentsPage';
import { CorpFinanceDashboardPage } from './pages/funds/CorpFinanceDashboardPage';

// Phase 9 Citizen Services Pages
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';
import { CitizenWardWorksPage } from './pages/citizen/CitizenWardWorksPage';
import { CitizenHelplinePage } from './pages/citizen/CitizenHelplinePage';
import { CitizenProfilePage } from './pages/citizen/CitizenProfilePage';
import { CitizenServicesCatalogPage } from './pages/services/CitizenServicesCatalogPage';
import { ServiceDetailsPage } from './pages/services/ServiceDetailsPage';
import { CreateApplicationWizardPage } from './pages/services/CreateApplicationWizardPage';
import { CitizenApplicationsPage } from './pages/services/CitizenApplicationsPage';
import { CitizenApplicationDetailsPage } from './pages/services/CitizenApplicationDetailsPage';
import { OfficerApplicationsPage } from './pages/services/OfficerApplicationsPage';
import { CorpAdminServicesPage } from './pages/services/CorpAdminServicesPage';
import { PublicCertificateVerificationPage } from './pages/services/PublicCertificateVerificationPage';

// Phase 10 GIS & Asset Pages
import { CorpGisDashboardPage } from './pages/gis/CorpGisDashboardPage';
import { CorpAssetsPage } from './pages/gis/CorpAssetsPage';
import { PublicAssetPage } from './pages/gis/PublicAssetPage';

// Phase 11 HRMS Pages
import { CorpHrmsDashboardPage } from './pages/hrms/CorpHrmsDashboardPage';
import { CorpEmployeesPage } from './pages/hrms/CorpEmployeesPage';
import { CorpAttendancePage } from './pages/hrms/CorpAttendancePage';
import { CorpLeavePage } from './pages/hrms/CorpLeavePage';
import { EmployeeSelfServicePage } from './pages/hrms/EmployeeSelfServicePage';

// Phase 12 Procurement Pages
import { CorpProcurementDashboardPage } from './pages/procurement/CorpProcurementDashboardPage';
import { CorpTendersPage } from './pages/procurement/CorpTendersPage';
import { CorpVendorsPage } from './pages/procurement/CorpVendorsPage';
import { CorpContractsPage } from './pages/procurement/CorpContractsPage';
import { PublicTendersPage } from './pages/procurement/PublicTendersPage';

// Phase 13 Revenue Pages
import { CorpRevenueDashboardPage } from './pages/revenue/CorpRevenueDashboardPage';
import { CorpPropertiesPage } from './pages/revenue/CorpPropertiesPage';
import { CorpBillsPage } from './pages/revenue/CorpBillsPage';
import { CorpWaterConnectionsPage } from './pages/revenue/CorpWaterConnectionsPage';
import { CitizenRevenuePortalPage } from './pages/revenue/CitizenRevenuePortalPage';
import { PublicTaxClearancePage } from './pages/revenue/PublicTaxClearancePage';

// Phase 14 Waste Pages
import { CorpWasteDashboardPage } from './pages/waste/CorpWasteDashboardPage';
import { CorpWasteHouseholdsPage } from './pages/waste/CorpWasteHouseholdsPage';
import { CorpWasteRoutesPage } from './pages/waste/CorpWasteRoutesPage';
import { CorpWasteCollectionsPage } from './pages/waste/CorpWasteCollectionsPage';
import { CorpSmartBinsPage } from './pages/waste/CorpSmartBinsPage';
import { CorpWasteWeighmentPage } from './pages/waste/CorpWasteWeighmentPage';
import { PublicBinPage } from './pages/waste/PublicBinPage';

// Phase 15 Utility Pages
import { CorpWaterDashboardPage } from './pages/utilities/CorpWaterDashboardPage';
import { CorpWaterSourcesPage } from './pages/utilities/CorpWaterSourcesPage';
import { CorpPipelinesPage } from './pages/utilities/CorpPipelinesPage';
import { CorpSupplySchedulesPage } from './pages/utilities/CorpSupplySchedulesPage';
import { CorpLeakagesPage } from './pages/utilities/CorpLeakagesPage';
import { CorpDrainagePage } from './pages/utilities/CorpDrainagePage';
import { CorpSeweragePage } from './pages/utilities/CorpSeweragePage';
import { PublicSupplySchedulePage } from './pages/utilities/PublicSupplySchedulePage';

// Phase 16 Road Pages
import { CorpRoadDashboardPage } from './pages/roads/CorpRoadDashboardPage';
import { CorpRoadsPage } from './pages/roads/CorpRoadsPage';
import { CorpPotholesPage } from './pages/roads/CorpPotholesPage';
import { CorpRoadRepairsPage } from './pages/roads/CorpRoadRepairsPage';
import { CorpRoadCuttingPage } from './pages/roads/CorpRoadCuttingPage';
import { CorpFootpathsPage } from './pages/roads/CorpFootpathsPage';
import { PublicRoadMapPage } from './pages/roads/PublicRoadMapPage';

// Phase 17 Health Pages
import { CorpHealthDashboardPage } from './pages/health/CorpHealthDashboardPage';
import { CorpHealthFacilitiesPage } from './pages/health/CorpHealthFacilitiesPage';
import { CorpHealthCampsPage } from './pages/health/CorpHealthCampsPage';
import { CorpSurveillancePage } from './pages/health/CorpSurveillancePage';
import { CorpVectorControlPage } from './pages/health/CorpVectorControlPage';
import { CorpFoodInspectionsPage } from './pages/health/CorpFoodInspectionsPage';
import { PublicHealthFacilitiesPage } from './pages/health/PublicHealthFacilitiesPage';

// Master Phases 18-24 Pages
import { CorpBpmsApplicationsPage } from './pages/bpms/CorpBpmsApplicationsPage';
import { CorpPropertiesEstatePage } from './pages/estate/CorpPropertiesEstatePage';
import { CorpFireStationsPage } from './pages/fire/CorpFireStationsPage';
import { CorpTreeCensusPage } from './pages/environment/CorpTreeCensusPage';
import { CorpParkingLotsPage } from './pages/parking/CorpParkingLotsPage';
import { CorpIotCommandCentrePage } from './pages/iot/CorpIotCommandCentrePage';
import { CorpExecutiveMisPage } from './pages/analytics/CorpExecutiveMisPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth, Certificate, Asset QR, Public Tender, Tax Clearance, Smart Bin QR, Water Schedule, Road Map & Health Facilities Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify/certificate/:certNo" element={<PublicCertificateVerificationPage />} />
        <Route path="/verify/tax-clearance/:certificateNumber" element={<PublicTaxClearancePage />} />
        <Route path="/public/assets/:assetCode" element={<PublicAssetPage />} />
        <Route path="/public/tenders" element={<PublicTendersPage />} />
        <Route path="/public/waste/bin/:binCode" element={<PublicBinPage />} />
        <Route path="/public/water/schedule" element={<PublicSupplySchedulePage />} />
        <Route path="/public/roads/map" element={<PublicRoadMapPage />} />
        <Route path="/public/health/facilities" element={<PublicHealthFacilitiesPage />} />

        {/* Protected Super Admin SaaS Routes (All 15 Sidebar Pages) */}
        <Route
          path="/super-admin/*"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminLayout>
                <Routes>
                  <Route path="dashboard" element={<SuperAdminDashboardPage />} />
                  <Route path="corporations" element={<CorporationsPage />} />
                  <Route path="corporations/create" element={<CreateCorporationWizardPage />} />
                  <Route path="corporations/:id" element={<CorporationDetailsPage />} />
                  <Route path="plans" element={<PlansPage />} />
                  <Route path="subscriptions" element={<SubscriptionsPage />} />
                  <Route path="users" element={<SuperAdminUsersPage />} />
                  <Route path="roles" element={<SuperAdminRolesPage />} />
                  <Route path="modules" element={<SuperAdminModulesPage />} />
                  <Route path="master-data" element={<SuperAdminMasterDataPage />} />
                  <Route path="notifications" element={<SuperAdminNotificationsPage />} />
                  <Route path="api-management" element={<SuperAdminApiManagementPage />} />
                  <Route path="gis" element={<SuperAdminGisPage />} />
                  <Route path="reports" element={<SuperAdminReportsPage />} />
                  <Route path="audit-logs" element={<AuditLogsPage />} />
                  <Route path="security" element={<SuperAdminSecurityPage />} />
                  <Route path="settings" element={<SuperAdminSettingsPage />} />
                  <Route path="*" element={<SuperAdminDashboardPage />} />
                </Routes>
              </SuperAdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Ward Admin Routes */}
        <Route
          path="/ward/*"
          element={
            <ProtectedRoute allowedRoles={['WARD_ADMIN', 'SUPER_ADMIN', 'CORPORATION_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<WardAdminDashboardPage />} />
                  <Route path="*" element={<WardAdminDashboardPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Corporator Ward Routes */}
        <Route
          path="/corporator/*"
          element={
            <ProtectedRoute allowedRoles={['CORPORATOR', 'SUPER_ADMIN', 'CORPORATION_ADMIN']}>
              <CorporatorLayout>
                <Routes>
                  <Route path="dashboard" element={<CorporatorDashboardPage />} />
                  <Route path="ward" element={<WardOverviewPage />} />
                  <Route path="smart-ward" element={<CorporatorSmartWardPage />} />
                  <Route path="complaints" element={<CorporatorComplaintsPage />} />
                  <Route path="complaints/map" element={<ComplaintMapPage />} />
                  <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
                  <Route path="works" element={<CorporatorWorksPage />} />
                  <Route path="works/:id" element={<WorkDetailsPage />} />
                  <Route path="funds" element={<CorporatorFundsPage />} />
                  <Route path="meetings" element={<CorporatorMeetingsPage />} />
                  <Route path="proposals" element={<CorporatorProposalsPage />} />
                  <Route path="followups" element={<CorporatorFollowupsPage />} />
                  <Route path="departments" element={<CorporatorDepartmentsPage />} />
                  <Route path="officers" element={<CorporatorOfficersPage />} />
                  <Route path="gis" element={<CorporatorGisPage />} />
                  <Route path="assets" element={<CorporatorAssetsPage />} />
                  <Route path="notifications" element={<CorporatorNotificationsPage />} />
                  <Route path="documents" element={<CorporatorDocumentsPage />} />
                  <Route path="reports" element={<CorporatorReportsPage />} />
                  <Route path="profile" element={<CorporatorProfilePage />} />
                  <Route path="settings" element={<CorporatorProfilePage />} />
                  <Route path="ai-assistant" element={<CorporatorAiPage />} />
                  <Route path="*" element={<CorporatorDashboardPage />} />
                </Routes>
              </CorporatorLayout>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Department Head Routes */}
        <Route
          path="/department-head/*"
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'SUPER_ADMIN', 'CORPORATION_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<DeptHeadDashboardPage />} />
                  <Route path="*" element={<DeptHeadDashboardPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Ward Officer Routes */}
        <Route
          path="/officer/*"
          element={
            <ProtectedRoute allowedRoles={['OFFICER', 'SUPER_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<OfficerDashboardPage />} />
                  <Route path="complaints" element={<OfficerComplaintsPage />} />
                  <Route path="applications" element={<OfficerApplicationsPage />} />
                  <Route path="*" element={<OfficerDashboardPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Field Staff Routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'SUPER_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<StaffDashboardPage />} />
                  <Route path="*" element={<StaffDashboardPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Dedicated Contractor Routes */}
        <Route
          path="/contractor/*"
          element={
            <ProtectedRoute allowedRoles={['CONTRACTOR', 'SUPER_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<ContractorDashboardPage />} />
                  <Route path="*" element={<ContractorDashboardPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Employee Self-Service Routes */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={['STAFF', 'OFFICER', 'SUPER_ADMIN', 'CORPORATION_ADMIN', 'CONTRACTOR']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<EmployeeSelfServicePage />} />
                  <Route path="*" element={<EmployeeSelfServicePage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Citizen Services Routes */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN', 'SUPER_ADMIN', 'CORPORATOR']}>
              <CitizenLayout>
                <CitizenDashboardPage />
              </CitizenLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/*"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN', 'SUPER_ADMIN', 'CORPORATOR']}>
              <CitizenLayout>
                <Routes>
                  <Route index element={<CitizenDashboardPage />} />
                  <Route path="" element={<CitizenDashboardPage />} />
                  <Route path="dashboard" element={<CitizenDashboardPage />} />
                  <Route path="complaints" element={<CitizenComplaintsPage />} />
                  <Route path="complaints/create" element={<CreateComplaintWizardPage />} />
                  <Route path="complaints/:id" element={<CitizenComplaintDetailsPage />} />
                  <Route path="services" element={<CitizenServicesCatalogPage />} />
                  <Route path="services/:id" element={<ServiceDetailsPage />} />
                  <Route path="services/:id/apply" element={<CreateApplicationWizardPage />} />
                  <Route path="applications" element={<CitizenApplicationsPage />} />
                  <Route path="applications/:id" element={<CitizenApplicationDetailsPage />} />
                  <Route path="revenue" element={<CitizenRevenuePortalPage />} />
                  <Route path="ward-works" element={<CitizenWardWorksPage />} />
                  <Route path="helpline" element={<CitizenHelplinePage />} />
                  <Route path="profile" element={<CitizenProfilePage />} />
                  <Route path="*" element={<CitizenDashboardPage />} />
                </Routes>
              </CitizenLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Corporation Admin Routes */}
        <Route
          path="/corporation/*"
          element={
            <ProtectedRoute allowedRoles={['CORPORATION_ADMIN', 'SUPER_ADMIN']}>
              <MainLayout>
                <Routes>
                  <Route path="complaints" element={<CorpAdminComplaintsPage />} />
                  <Route path="complaints/analytics" element={<ComplaintAnalyticsPage />} />
                  <Route path="works" element={<CorpWorksPage />} />
                  <Route path="works/dashboard" element={<CorpWorksDashboardPage />} />
                  <Route path="works/create" element={<CreateWorkWizardPage />} />
                  <Route path="works/:id" element={<WorkDetailsPage />} />
                  <Route path="contractors" element={<ContractorsPage />} />
                  <Route path="budget" element={<CorpBudgetPage />} />
                  <Route path="funds" element={<CorpFundsPage />} />
                  <Route path="expenditure" element={<CorpExpenditurePage />} />
                  <Route path="payments" element={<CorpPaymentsPage />} />
                  <Route path="finance/dashboard" element={<CorpFinanceDashboardPage />} />
                  <Route path="services" element={<CorpAdminServicesPage />} />
                  <Route path="gis" element={<CorpGisDashboardPage />} />
                  <Route path="assets" element={<CorpAssetsPage />} />
                  <Route path="hrms/dashboard" element={<CorpHrmsDashboardPage />} />
                  <Route path="hrms/employees" element={<CorpEmployeesPage />} />
                  <Route path="hrms/attendance" element={<CorpAttendancePage />} />
                  <Route path="hrms/leave" element={<CorpLeavePage />} />
                  <Route path="procurement/dashboard" element={<CorpProcurementDashboardPage />} />
                  <Route path="procurement/tenders" element={<CorpTendersPage />} />
                  <Route path="procurement/vendors" element={<CorpVendorsPage />} />
                  <Route path="procurement/contracts" element={<CorpContractsPage />} />
                  <Route path="revenue/dashboard" element={<CorpRevenueDashboardPage />} />
                  <Route path="revenue/properties" element={<CorpPropertiesPage />} />
                  <Route path="revenue/bills" element={<CorpBillsPage />} />
                  <Route path="revenue/water" element={<CorpWaterConnectionsPage />} />
                  <Route path="waste/dashboard" element={<CorpWasteDashboardPage />} />
                  <Route path="waste/households" element={<CorpWasteHouseholdsPage />} />
                  <Route path="waste/routes" element={<CorpWasteRoutesPage />} />
                  <Route path="waste/collections" element={<CorpWasteCollectionsPage />} />
                  <Route path="waste/bins" element={<CorpSmartBinsPage />} />
                  <Route path="waste/weighment" element={<CorpWasteWeighmentPage />} />
                  <Route path="water/dashboard" element={<CorpWaterDashboardPage />} />
                  <Route path="water/sources" element={<CorpWaterSourcesPage />} />
                  <Route path="water/pipelines" element={<CorpPipelinesPage />} />
                  <Route path="water/schedules" element={<CorpSupplySchedulesPage />} />
                  <Route path="water/leakages" element={<CorpLeakagesPage />} />
                  <Route path="drainage/drains" element={<CorpDrainagePage />} />
                  <Route path="sewerage/stp" element={<CorpSeweragePage />} />
                  <Route path="roads/dashboard" element={<CorpRoadDashboardPage />} />
                  <Route path="roads" element={<CorpRoadsPage />} />
                  <Route path="roads/potholes" element={<CorpPotholesPage />} />
                  <Route path="roads/repairs" element={<CorpRoadRepairsPage />} />
                  <Route path="roads/cutting" element={<CorpRoadCuttingPage />} />
                  <Route path="roads/footpaths" element={<CorpFootpathsPage />} />
                  <Route path="health/dashboard" element={<CorpHealthDashboardPage />} />
                  <Route path="health/facilities" element={<CorpHealthFacilitiesPage />} />
                  <Route path="health/camps" element={<CorpHealthCampsPage />} />
                  <Route path="health/surveillance" element={<CorpSurveillancePage />} />
                  <Route path="health/vector" element={<CorpVectorControlPage />} />
                  <Route path="health/food-inspections" element={<CorpFoodInspectionsPage />} />
                  <Route path="bpms/applications" element={<CorpBpmsApplicationsPage />} />
                  <Route path="estate/properties" element={<CorpPropertiesEstatePage />} />
                  <Route path="fire/stations" element={<CorpFireStationsPage />} />
                  <Route path="environment/trees" element={<CorpTreeCensusPage />} />
                  <Route path="parking/lots" element={<CorpParkingLotsPage />} />
                  <Route path="iot/command-centre" element={<CorpIotCommandCentrePage />} />
                  <Route path="analytics/executive" element={<CorpExecutiveMisPage />} />
                  <Route path="*" element={<CorpWorksPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
                <Route path="/works" element={<ProtectedRoute><WorksPage /></ProtectedRoute>} />
                <Route path="/funds" element={<ProtectedRoute><FundsPage /></ProtectedRoute>} />
                <Route path="/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
                <Route path="/proposals" element={<ProtectedRoute><ProposalsPage /></ProtectedRoute>} />
                <Route path="/gis" element={<ProtectedRoute><GisPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
