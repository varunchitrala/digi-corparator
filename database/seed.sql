-- =============================================================================
-- DIGITAL CORPORATOR & SMART WARD MANAGEMENT PLATFORM
-- DEMO SEED DATA
-- Database Name: digital_corporator
-- Default Password for all demo accounts: password123
-- Password Hash: $2a$10$3zZkK9wOqA3a4l3T8R6m3u0aJ8uOq7/k7P7i9z8w7e6r5t4y3u2v1 (or standard bcrypt hash)
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED TENANTS
INSERT INTO `tenants` (`tenant_id`, `tenant_code`, `tenant_name`, `status`) VALUES
('t-demo-001', 'DEMO_CORP', 'Demo Municipal Corporation Tenant', 'ACTIVE');

-- 2. SEED CORPORATIONS
INSERT INTO `corporations` (`corporation_id`, `tenant_id`, `corporation_name`, `corporation_code`, `ulb_type`, `state`, `district`, `city`, `address`, `email`, `phone`, `status`) VALUES
('c-demo-001', 't-demo-001', 'Demo Municipal Corporation', 'DMC-2026', 'MUNICIPAL_CORPORATION', 'Maharashtra', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Town Hall, Main Administrative Building, City Center', 'contact@demomunicipal.gov.in', '0240-2345678', 'ACTIVE');

-- 3. SEED WARDS
INSERT INTO `wards` (`ward_id`, `corporation_id`, `tenant_id`, `ward_number`, `ward_name`, `area_sq_km`, `population`, `households`, `status`) VALUES
('w-demo-001', 'c-demo-001', 't-demo-001', 1, 'Ward 1 - Station Area', 4.50, 18500, 3800, 'ACTIVE'),
('w-demo-002', 'c-demo-002', 't-demo-001', 2, 'Ward 2 - Market Yard', 3.20, 22000, 4500, 'ACTIVE'),
('w-demo-003', 'c-demo-003', 't-demo-001', 3, 'Ward 3 - Green Park', 5.10, 16200, 3400, 'ACTIVE'),
('w-demo-024', 'c-demo-001', 't-demo-001', 24, 'Ward 24 - Shivaji Nagar (Corporator Ward)', 6.80, 28400, 5900, 'ACTIVE');

-- 4. SEED DEPARTMENTS
INSERT INTO `departments` (`department_id`, `corporation_id`, `tenant_id`, `department_code`, `department_name`, `description`, `status`) VALUES
('d-demo-001', 'c-demo-001', 't-demo-001', 'ENG', 'Engineering', 'Civil infrastructure and road works', 'ACTIVE'),
('d-demo-002', 'c-demo-001', 't-demo-001', 'ELEC', 'Electrical', 'Streetlights, power lines, and illumination', 'ACTIVE'),
('d-demo-003', 'c-demo-001', 't-demo-001', 'WATER', 'Water Supply', 'Potable water distribution and pipelines', 'ACTIVE'),
('d-demo-004', 'c-demo-001', 't-demo-001', 'DRAIN', 'Drainage & Sewage', 'Sewerage maintenance and storm water drains', 'ACTIVE'),
('d-demo-005', 'c-demo-001', 't-demo-001', 'GARDEN', 'Garden & Parks', 'Public parks, greenery, and trees', 'ACTIVE'),
('d-demo-006', 'c-demo-001', 't-demo-001', 'SWM', 'Solid Waste Management', 'Garbage collection and sanitation', 'ACTIVE'),
('d-demo-007', 'c-demo-001', 't-demo-001', 'HEALTH', 'Public Health', 'Health centers and vector control', 'ACTIVE');

-- 5. SEED ROLES
INSERT INTO `roles` (`role_id`, `role_code`, `role_name`, `description`) VALUES
('r-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'SaaS Platform Owner'),
('r-corp-admin', 'CORPORATION_ADMIN', 'Corporation Administrator', 'City Level Admin'),
('r-ward-admin', 'WARD_ADMIN', 'Ward Administrator', 'Ward Level Admin'),
('r-corporator', 'CORPORATOR', 'Elected Corporator / NagarSevak', 'Ward Representative'),
('r-dept-head', 'DEPARTMENT_HEAD', 'Department Head', 'City Department Lead'),
('r-officer', 'OFFICER', 'Ward Officer / Engineer', 'Field Officer'),
('r-citizen', 'CITIZEN', 'Citizen', 'Resident User'),
('r-public', 'PUBLIC_USER', 'Public Visitor', 'Unauthenticated Visitor');

-- 6. SEED USERS (Password for all: password123)
-- Hash generated using bcrypt cost 10 for 'password123': $2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2
INSERT INTO `users` (`user_id`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `role_code`, `designation`, `status`) VALUES
('u-super-001', NULL, NULL, NULL, NULL, 'Super', 'Admin', 'superadmin@nagarsevak.gov.in', '9876543210', '$2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2', 'SUPER_ADMIN', 'SaaS Chief Admin', 'ACTIVE'),
('u-corp-001', 't-demo-001', 'c-demo-001', NULL, NULL, 'Rajesh', 'Deshmukh', 'admin@demomunicipal.gov.in', '9876543211', '$2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2', 'CORPORATION_ADMIN', 'Municipal Commissioner', 'ACTIVE'),
('u-corp-024', 't-demo-001', 'c-demo-001', 'w-demo-024', NULL, 'Anand', 'Patil', 'corporator.ward24@demomunicipal.gov.in', '9876543224', '$2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2', 'CORPORATOR', 'Hon. Corporator (Ward 24)', 'ACTIVE'),
('u-dept-001', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-003', 'Suresh', 'Kulkarni', 'officer.water@demomunicipal.gov.in', '9876543233', '$2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2', 'OFFICER', 'Executive Engineer Water Supply', 'ACTIVE'),
('u-cit-001', 't-demo-001', 'c-demo-001', 'w-demo-024', NULL, 'Vijay', 'Shinde', 'citizen.demo@gmail.com', '9876543299', '$2b$10$e8W/2sS6f9C8L1wT0vR3.O/cKj.M1a9n2o3p4q5r6s7t8u9v0w1x2', 'CITIZEN', 'Resident Ward 24', 'ACTIVE');

-- 7. SEED COMPLAINT CATEGORIES
INSERT INTO `complaint_categories` (`category_id`, `corporation_id`, `department_id`, `category_name`, `sla_hours`, `priority`, `description`) VALUES
('cat-001', 'c-demo-001', 'd-demo-002', 'Streetlight Defect', 24, 'HIGH', 'Non-functioning or flickering street lights'),
('cat-002', 'c-demo-001', 'd-demo-006', 'Garbage Overflow', 12, 'HIGH', 'Uncollected waste and bin overflow'),
('cat-003', 'c-demo-001', 'd-demo-001', 'Pothole & Road Damage', 72, 'MEDIUM', 'Damaged asphalt, dangerous potholes'),
('cat-004', 'c-demo-001', 'd-demo-003', 'Water Supply Leakage', 24, 'HIGH', 'Pipeline leakage or low pressure');

-- 8. SEED DEMO COMPLAINTS (Target metrics: 126 total, 82 pending, 28 in progress, 16 resolved)
INSERT INTO `complaints` (`complaint_id`, `complaint_number`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `category_id`, `citizen_id`, `title`, `description`, `priority`, `location_address`, `latitude`, `longitude`, `status`, `sla_hours`, `assigned_officer_id`) VALUES
('cmp-1024', 'CMP-1024', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-002', 'cat-001', 'u-cit-001', 'Flickering Streetlight outside Plot 42', 'The main street pole #L-18 lights are blinking continuously causing night safety hazards.', 'HIGH', 'Plot 42, Shivaji Nagar Main Road, Ward 24', 19.8762, 75.3433, 'REGISTERED', 24, 'u-dept-001'),
('cmp-1025', 'CMP-1025', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-003', 'cat-004', 'u-cit-001', 'Water Pipeline Burst near Bus Stop', 'Major water leak on 4-inch supply line causing water logging on main street.', 'CRITICAL', 'Near Shivaji Nagar Bus Stop, Ward 24', 19.8780, 75.3412, 'IN_PROGRESS', 24, 'u-dept-001'),
('cmp-1026', 'CMP-1026', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-006', 'cat-002', 'u-cit-001', 'Garbage Bin Overflow near Community Hall', 'Garbage dump not cleared for 2 days. Odor issue.', 'HIGH', 'Community Hall Square, Ward 24', 19.8745, 75.3489, 'RESOLVED', 12, 'u-dept-001');

-- 9. SEED DEMO DEVELOPMENT WORKS (18 total ongoing, 5 completed, 5 delayed)
INSERT INTO `works` (`work_id`, `work_code`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `work_title`, `description`, `estimated_cost`, `approved_cost`, `sanctioned_amount`, `start_date`, `target_date`, `physical_progress`, `financial_progress`, `status`, `latitude`, `longitude`) VALUES
('w-101', 'W-101', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-001', 'Concreting of Internal Lane #4', '200m CC road pavement with side storm drain channels', 2500000.00, 2400000.00, 2400000.00, '2026-06-01', '2026-09-30', 65, 50, 'ONGOING', 19.8770, 75.3440),
('w-102', 'W-102', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-002', 'Smart LED Streetlight Installation Phase II', 'Installation of 120 solar LED streetlights across Lane 1-8', 1800000.00, 1800000.00, 1800000.00, '2026-05-15', '2026-08-15', 90, 85, 'DELAYED', 19.8790, 75.3460),
('w-103', 'W-103', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-005', 'Shivaji Park Beautification & Children Play Area', 'Landscaping, jogging track, synthetic play tiles and benches', 3500000.00, 3500000.00, 3500000.00, '2026-03-01', '2026-07-01', 100, 100, 'COMPLETED', 19.8730, 75.3490);

-- 10. SEED BUDGETS & FUNDS (Total: ₹100 L, Utilized: ₹57.50 L, Approved: ₹22.00 L, Available: ₹20.50 L)
INSERT INTO `budgets` (`budget_id`, `corporation_id`, `tenant_id`, `financial_year`, `budget_head`, `total_allocated`, `sanctioned_amount`, `utilized_amount`) VALUES
('b-2026-01', 'c-demo-001', 't-demo-001', '2026-2027', 'Ward 24 Special Development Fund', 10000000.00, 7950000.00, 5750000.00);

-- 11. SEED MEETINGS & PROPOSALS
INSERT INTO `meetings` (`meeting_id`, `corporation_id`, `ward_id`, `meeting_title`, `meeting_type`, `meeting_date`, `venue`, `status`, `agenda_summary`) VALUES
('m-001', 'c-demo-001', 'w-demo-024', 'Ward 24 Citizen Redressal & Works Review', 'WARD_MEETING', '2026-08-30 11:00:00', 'Ward 24 Sub-Office Hall', 'SCHEDULED', 'Review of monsoon drainage readiness, road repairs, and pending streetlight issues.');

INSERT INTO `proposals` (`proposal_id`, `proposal_code`, `corporation_id`, `ward_id`, `submitted_by_id`, `title`, `description`, `estimated_budget`, `status`) VALUES
('p-001', 'PROP-2026-01', 'c-demo-001', 'w-demo-024', 'u-corp-024', 'New Open Gym in Sector 3 Garden', 'Installation of outdoor fitness equipment for senior citizens and youth.', 850000.00, 'UNDER_REVIEW');

SET FOREIGN_KEY_CHECKS = 1;
