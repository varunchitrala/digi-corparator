-- =============================================================================
-- PHASE 10: GIS, MUNICIPAL ASSETS & SMART WARD MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ALTER EXISTING GIS LAYERS TABLE
ALTER TABLE `gis_layers` ADD COLUMN `corporation_id` VARCHAR(36) DEFAULT 'c-demo-001' AFTER `layer_id`;
ALTER TABLE `gis_layers` ADD COLUMN `category` VARCHAR(100) DEFAULT 'INFRASTRUCTURE' AFTER `color`;
ALTER TABLE `gis_layers` ADD COLUMN `default_visible` BOOLEAN DEFAULT TRUE AFTER `category`;
ALTER TABLE `gis_layers` ADD COLUMN `is_public` BOOLEAN DEFAULT TRUE AFTER `default_visible`;

-- 2. ASSET CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `asset_categories` (
  `category_id` VARCHAR(36) PRIMARY KEY,
  `category_code` VARCHAR(50) NOT NULL UNIQUE,
  `category_name` VARCHAR(150) NOT NULL,
  `icon_name` VARCHAR(50) DEFAULT 'MapPin',
  `description` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ASSETS MASTER TABLE
CREATE TABLE IF NOT EXISTS `assets` (
  `asset_id` VARCHAR(36) PRIMARY KEY,
  `asset_code` VARCHAR(50) UNIQUE NOT NULL,
  `asset_name` VARCHAR(200) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'DAMAGED', 'CONDEMNED', 'DISPOSED', 'ARCHIVED') DEFAULT 'ACTIVE',
  `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL') DEFAULT 'GOOD',
  `health_score` INT DEFAULT 85,
  `installation_date` DATE DEFAULT NULL,
  `estimated_value` DECIMAL(15,2) DEFAULT '0.00',
  `current_value` DECIMAL(15,2) DEFAULT '0.00',
  `public_visibility` BOOLEAN DEFAULT TRUE,
  `description` TEXT DEFAULT NULL,
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_asset_cat` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ASSET LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS `asset_locations` (
  `location_id` VARCHAR(36) PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL UNIQUE,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `landmark` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_loc_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ASSET INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `asset_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `inspector_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `inspection_type` ENUM('ROUTINE', 'COMPLAINT', 'DAMAGE', 'QUALITY', 'FINAL') DEFAULT 'ROUTINE',
  `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL') NOT NULL,
  `findings` TEXT NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_insp_ast` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ASSET MAINTENANCE TABLE
CREATE TABLE IF NOT EXISTS `asset_maintenance` (
  `maintenance_id` VARCHAR(36) PRIMARY KEY,
  `maintenance_number` VARCHAR(50) UNIQUE NOT NULL,
  `asset_id` VARCHAR(36) NOT NULL,
  `maintenance_type` ENUM('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'REPLACEMENT') DEFAULT 'CORRECTIVE',
  `description` TEXT NOT NULL,
  `estimated_cost` DECIMAL(15,2) DEFAULT '0.00',
  `actual_cost` DECIMAL(15,2) DEFAULT '0.00',
  `status` ENUM('DRAFT', 'SCHEDULED', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
  `assigned_to_id` VARCHAR(36) DEFAULT NULL,
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT `fk_mnt_ast` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ASSET LIFECYCLE HISTORY TABLE
CREATE TABLE IF NOT EXISTS `asset_lifecycle_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `old_status` VARCHAR(50) DEFAULT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `performed_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lhist_ast` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SEED ASSET CATEGORIES
INSERT INTO `asset_categories` (`category_id`, `category_code`, `category_name`, `icon_name`, `description`) VALUES
('acat-001', 'ACAT-LIGHT', 'LED Streetlight Pole', 'Zap', 'Municipal street illumination assets'),
('acat-002', 'ACAT-ROAD', 'Asphalt / Paver Road Section', 'Truck', 'Municipal road and footpath infrastructure'),
('acat-003', 'ACAT-DRAIN', 'Storm Water Drain Line', 'Droplet', 'Underground & open storm water drainage'),
('acat-004', 'ACAT-WATER', 'Drinking Water Pipeline & Pump', 'Activity', 'Water supply main lines and valves'),
('acat-005', 'ACAT-GARDEN', 'Public Garden / Playground', 'Sun', 'Municipal parks, trees and open spaces')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

-- SEED DEMO ASSETS FOR WARD 24
INSERT INTO `assets` (`asset_id`, `asset_code`, `asset_name`, `category_id`, `corporation_id`, `ward_id`, `status`, `condition`, `health_score`, `installation_date`, `estimated_value`, `public_visibility`, `description`, `created_by_id`) VALUES
('ast-001', 'AST-2026-000001', 'LED Streetlight Pole W24-L10', 'acat-001', 'c-demo-001', 'w-demo-024', 'ACTIVE', 'GOOD', 90, '2025-01-15', 25000.00, TRUE, '100W Smart LED Pole Main Road Ward 24', 'u-corp-001'),
('ast-002', 'AST-2026-000002', 'Main Road Asphalt Stretch W24', 'acat-002', 'c-demo-001', 'w-demo-024', 'ACTIVE', 'FAIR', 75, '2024-06-10', 1200000.00, TRUE, '2km Asphalt Road Section Ward 24', 'u-corp-001'),
('ast-003', 'AST-2026-000003', 'Storm Water Underground Drain W24', 'acat-003', 'c-demo-001', 'w-demo-024', 'UNDER_MAINTENANCE', 'POOR', 45, '2023-04-20', 800000.00, TRUE, 'Main Drainage Pipeline Ward 24', 'u-corp-001'),
('ast-004', 'AST-2026-000004', 'Shivaji Municipal Park W24', 'acat-005', 'c-demo-001', 'w-demo-024', 'ACTIVE', 'EXCELLENT', 95, '2022-11-05', 2500000.00, TRUE, 'Public Park & Children Playground Ward 24', 'u-corp-001')
ON DUPLICATE KEY UPDATE `asset_name` = VALUES(`asset_name`);

INSERT INTO `asset_locations` (`location_id`, `asset_id`, `latitude`, `longitude`, `address`, `landmark`) VALUES
('loc-001', 'ast-001', 19.87620000, 75.34330000, 'Main Road Ward 24', 'Near Water Tank'),
('loc-002', 'ast-002', 19.87800000, 75.34500000, 'Central Avenue Ward 24', 'Opposite Municipal School'),
('loc-003', 'ast-003', 19.87500000, 75.34100000, 'Drainage Line Ward 24', 'Near Market Yard'),
('loc-004', 'ast-004', 19.88000000, 75.34700000, 'Shivaji Park Ward 24', 'Sector 4')
ON DUPLICATE KEY UPDATE `latitude` = VALUES(`latitude`);

SET FOREIGN_KEY_CHECKS = 1;
