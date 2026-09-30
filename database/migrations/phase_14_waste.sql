-- =============================================================================
-- PHASE 14: SOLID WASTE MANAGEMENT, SANITATION & CLEAN CITY SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. WASTE HOUSEHOLDS TABLE
CREATE TABLE IF NOT EXISTS `waste_households` (
  `household_id` VARCHAR(36) PRIMARY KEY,
  `household_number` VARCHAR(50) UNIQUE NOT NULL,
  `property_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `waste_category` ENUM('WET', 'DRY', 'MIXED', 'HAZARDOUS', 'RECYCLABLE') DEFAULT 'WET',
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WASTE ROUTES TABLE
CREATE TABLE IF NOT EXISTS `waste_routes` (
  `route_id` VARCHAR(36) PRIMARY KEY,
  `route_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `route_name` VARCHAR(150) NOT NULL,
  `vehicle_id` VARCHAR(36) DEFAULT 'ast-001',
  `driver_id` VARCHAR(36) DEFAULT 'emp-001',
  `distance_km` DECIMAL(8,2) DEFAULT '5.50',
  `status` ENUM('DRAFT', 'ACTIVE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. WASTE COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS `waste_collections` (
  `collection_id` VARCHAR(36) PRIMARY KEY,
  `collection_number` VARCHAR(50) UNIQUE NOT NULL,
  `household_id` VARCHAR(36) NOT NULL,
  `route_id` VARCHAR(36) NOT NULL,
  `vehicle_id` VARCHAR(36) DEFAULT NULL,
  `collector_id` VARCHAR(36) NOT NULL,
  `collection_date` DATE NOT NULL,
  `waste_type` ENUM('WET', 'DRY', 'MIXED', 'RECYCLABLE') DEFAULT 'WET',
  `actual_quantity_kg` DECIMAL(8,2) NOT NULL DEFAULT '2.50',
  `status` ENUM('SCHEDULED', 'ASSIGNED', 'STARTED', 'COLLECTED', 'MISSED', 'PARTIAL', 'REJECTED') DEFAULT 'COLLECTED',
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wcol_hh` FOREIGN KEY (`household_id`) REFERENCES `waste_households` (`household_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wcol_rt` FOREIGN KEY (`route_id`) REFERENCES `waste_routes` (`route_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SMART BIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS `waste_bin_profiles` (
  `bin_id` VARCHAR(36) PRIMARY KEY,
  `bin_code` VARCHAR(50) UNIQUE NOT NULL,
  `asset_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `bin_type` ENUM('DRY', 'WET', 'MIXED', 'RECYCLABLE') DEFAULT 'DRY',
  `capacity_liters` INT DEFAULT 500,
  `fill_level_percent` INT DEFAULT 45,
  `address` TEXT NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT '19.87620000',
  `longitude` DECIMAL(11,8) DEFAULT '75.34330000',
  `status` ENUM('ACTIVE', 'FULL', 'DAMAGED', 'UNDER_MAINTENANCE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WASTE WEIGHMENTS TABLE
CREATE TABLE IF NOT EXISTS `waste_weighments` (
  `weighment_id` VARCHAR(36) PRIMARY KEY,
  `weighment_number` VARCHAR(50) UNIQUE NOT NULL,
  `vehicle_id` VARCHAR(36) NOT NULL,
  `gross_weight_kg` DECIMAL(10,2) NOT NULL,
  `tare_weight_kg` DECIMAL(10,2) NOT NULL,
  `net_weight_kg` DECIMAL(10,2) NOT NULL,
  `waste_type` ENUM('WET', 'DRY', 'MIXED', 'RECYCLABLE') DEFAULT 'MIXED',
  `weighment_date` DATE NOT NULL,
  `operator_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SANITATION INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `waste_sanitation_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `inspector_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `cleanliness_score` INT NOT NULL DEFAULT 85,
  `findings` TEXT NOT NULL,
  `status` ENUM('COMPLETED', 'ACTION_REQUIRED') DEFAULT 'COMPLETED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SEED DEMO HOUSEHOLDS, ROUTES, BINS & WEIGHMENTS
INSERT INTO `waste_households` (`household_id`, `household_number`, `corporation_id`, `ward_id`, `owner_name`, `address`, `waste_category`, `status`) VALUES
('hh-001', 'HH-2026-000001', 'c-demo-001', 'w-demo-024', 'Ramesh Patil', 'Plot 45 Civil Lines Ward 24', 'WET', 'ACTIVE'),
('hh-002', 'HH-2026-000002', 'c-demo-001', 'w-demo-024', 'Sanjay Kulkarni', 'Sector 4 Ward 24', 'DRY', 'ACTIVE')
ON DUPLICATE KEY UPDATE `owner_name` = VALUES(`owner_name`);

INSERT INTO `waste_routes` (`route_id`, `route_number`, `corporation_id`, `ward_id`, `route_name`, `distance_km`, `status`) VALUES
('rt-001', 'ROUTE-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Morning Sanitation Route', 6.20, 'ACTIVE')
ON DUPLICATE KEY UPDATE `route_name` = VALUES(`route_name`);

INSERT INTO `waste_bin_profiles` (`bin_id`, `bin_code`, `corporation_id`, `ward_id`, `bin_type`, `capacity_liters`, `fill_level_percent`, `address`, `status`) VALUES
('bin-001', 'BIN-2026-000001', 'c-demo-001', 'w-demo-024', 'DRY', 500, 45, 'Market Yard Ward 24', 'ACTIVE'),
('bin-002', 'BIN-2026-000002', 'c-demo-001', 'w-demo-024', 'WET', 500, 85, 'Bus Stand Ward 24', 'FULL')
ON DUPLICATE KEY UPDATE `bin_code` = VALUES(`bin_code`);

INSERT INTO `waste_weighments` (`weighment_id`, `weighment_number`, `vehicle_id`, `gross_weight_kg`, `tare_weight_kg`, `net_weight_kg`, `waste_type`, `weighment_date`, `operator_id`) VALUES
('wt-001', 'WT-2026-000001', 'ast-001', 10000.00, 4000.00, 6000.00, 'MIXED', CURDATE(), 'u-corp-001')
ON DUPLICATE KEY UPDATE `gross_weight_kg` = VALUES(`gross_weight_kg`);

SET FOREIGN_KEY_CHECKS = 1;
