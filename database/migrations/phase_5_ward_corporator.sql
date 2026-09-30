-- =============================================================================
-- PHASE 5: WARD & CORPORATOR MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. FOLLOWUPS TABLE
CREATE TABLE IF NOT EXISTS `followups` (
  `followup_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `assigned_officer_id` VARCHAR(36) DEFAULT NULL,
  `matter` VARCHAR(255) NOT NULL,
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `due_date` DATE NOT NULL,
  `status` ENUM('PENDING', 'DUE_TODAY', 'OVERDUE', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_flw_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_flw_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WARD ASSETS TABLE
CREATE TABLE IF NOT EXISTS `ward_assets` (
  `asset_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `asset_type` ENUM('STREETLIGHT', 'ROAD', 'GARDEN', 'WATER_POINT', 'DRAINAGE', 'GARBAGE_BIN', 'PUBLIC_TOILET', 'COMMUNITY_HALL', 'SCHOOL', 'HEALTH_CENTER') NOT NULL,
  `asset_name` VARCHAR(150) NOT NULL,
  `location_address` TEXT NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `status` ENUM('OPERATIONAL', 'MAINTENANCE_REQUIRED', 'UNDER_REPAIR', 'INACTIVE') DEFAULT 'OPERATIONAL',
  `last_inspection_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ast_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ast_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. WARD PERFORMANCE METRICS TABLE
CREATE TABLE IF NOT EXISTS `ward_performance_metrics` (
  `metric_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `period_month` VARCHAR(20) NOT NULL,
  `complaint_resolution_rate` DECIMAL(5,2) DEFAULT '82.50',
  `sla_compliance_rate` DECIMAL(5,2) DEFAULT '76.00',
  `work_completion_rate` DECIMAL(5,2) DEFAULT '68.40',
  `fund_utilization_rate` DECIMAL(5,2) DEFAULT '70.00',
  `citizen_satisfaction_score` DECIMAL(5,2) DEFAULT '84.00',
  `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_ward_period` (`corporation_id`, `ward_id`, `period_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CORPORATOR PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS `corporator_preferences` (
  `preference_id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `theme` VARCHAR(20) DEFAULT 'LIGHT',
  `notification_email` BOOLEAN DEFAULT TRUE,
  `notification_sms` BOOLEAN DEFAULT TRUE,
  `dashboard_widgets` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WARD ASSET HISTORY TABLE
CREATE TABLE IF NOT EXISTS `ward_asset_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `inspector_id` VARCHAR(36) DEFAULT NULL,
  `remarks` TEXT,
  `status` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_asth_ast` FOREIGN KEY (`asset_id`) REFERENCES `ward_assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SEED EXPANDED DEMO DATA FOR WARD 24 (SHIVAJI NAGAR)
-- Seed Additional Complaints
INSERT INTO `complaints` (`complaint_id`, `complaint_number`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `category_id`, `citizen_id`, `title`, `description`, `priority`, `location_address`, `latitude`, `longitude`, `status`, `sla_hours`, `assigned_officer_id`) VALUES
('cmp-1027', 'CMP-1027', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-004', 'cat-004', 'u-cit-001', 'Drainage Overflow on Lane #3', 'Storm water drain blocked near primary school', 'HIGH', 'Lane #3, Shivaji Nagar, Ward 24', 19.8750, 75.3420, 'IN_PROGRESS', 24, 'u-dept-001'),
('cmp-1028', 'CMP-1028', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-001', 'cat-003', 'u-cit-001', 'Pothole Hazard near Vegetable Market', 'Deep pothole causing vehicle damage near entrance', 'CRITICAL', 'Market Gate, Shivaji Nagar, Ward 24', 19.8765, 75.3450, 'REGISTERED', 12, 'u-dept-001'),
('cmp-1029', 'CMP-1029', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-005', 'cat-001', 'u-cit-001', 'Fallen Tree Branch in Shivaji Park', 'Large branch blocking pedestrian walkway', 'MEDIUM', 'Shivaji Park, Ward 24', 19.8735, 75.3495, 'ESCALATED', 24, 'u-dept-001'),
('cmp-1030', 'CMP-1030', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-002', 'cat-001', 'u-cit-001', 'Dark Spot: Missing Pole Lights', 'Streetlight pole broken near water tank', 'HIGH', 'Sector 4 Water Tank, Ward 24', 19.8785, 75.3400, 'INSPECTION', 24, 'u-dept-001')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Seed Followups
INSERT INTO `followups` (`followup_id`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `assigned_officer_id`, `matter`, `priority`, `due_date`, `status`, `remarks`) VALUES
('flw-001', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-001', 'u-dept-001', 'Expedite Lane #4 Concreting Progress Inspection', 'HIGH', CURDATE(), 'DUE_TODAY', 'Contractor requested interim bill inspection'),
('flw-002', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-003', 'u-dept-001', 'Resolve Water Supply Pressure Deficit in Sector 2', 'CRITICAL', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'OVERDUE', 'Citizens submitted petition regarding low pressure'),
('flw-003', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-006', 'u-dept-001', 'Deploy additional SWM vehicle during festival week', 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'PENDING', 'Special sanitation drive planned')
ON DUPLICATE KEY UPDATE `matter` = VALUES(`matter`);

-- Seed Ward Public Assets
INSERT INTO `ward_assets` (`asset_id`, `tenant_id`, `corporation_id`, `ward_id`, `department_id`, `asset_type`, `asset_name`, `location_address`, `latitude`, `longitude`, `status`, `last_inspection_date`) VALUES
('ast-001', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-002', 'STREETLIGHT', 'Smart Solar LED Pole #L-18', 'Shivaji Nagar Main Road, Ward 24', 19.8762, 75.3433, 'OPERATIONAL', CURDATE()),
('ast-002', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-003', 'WATER_POINT', 'Sub-Station ESR Water Tank', 'Sector 4 Elevated Reservoir, Ward 24', 19.8785, 75.3400, 'MAINTENANCE_REQUIRED', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
('ast-003', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-005', 'GARDEN', 'Shivaji Children Park & Garden', 'Green Park Road, Ward 24', 19.8730, 75.3490, 'OPERATIONAL', CURDATE()),
('ast-004', 't-demo-001', 'c-demo-001', 'w-demo-024', 'd-demo-001', 'SCHOOL', 'Ward 24 Municipal Primary School', 'Station Road, Ward 24', 19.8740, 75.3460, 'OPERATIONAL', DATE_SUB(CURDATE(), INTERVAL 10 DAY))
ON DUPLICATE KEY UPDATE `asset_name` = VALUES(`asset_name`);

SET FOREIGN_KEY_CHECKS = 1;
