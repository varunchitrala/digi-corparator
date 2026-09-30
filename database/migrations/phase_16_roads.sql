-- =============================================================================
-- PHASE 16: ROADS, FOOTPATH, STREET INFRASTRUCTURE & TRAFFIC SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROADS MASTER TABLE
CREATE TABLE IF NOT EXISTS `roads` (
  `road_id` VARCHAR(36) PRIMARY KEY,
  `road_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `road_name` VARCHAR(150) NOT NULL,
  `road_type` ENUM('CITY_ROAD', 'MAIN_ROAD', 'ARTERIAL', 'RESIDENTIAL', 'SERVICE_ROAD') DEFAULT 'MAIN_ROAD',
  `surface_type` ENUM('BITUMEN', 'CONCRETE', 'PAVER', 'GRAVEL') DEFAULT 'BITUMEN',
  `length_meters` DECIMAL(10,2) DEFAULT '2500.00',
  `width_meters` DECIMAL(5,2) DEFAULT '12.00',
  `condition` ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL') DEFAULT 'GOOD',
  `status` ENUM('ACTIVE', 'UNDER_REPAIR', 'CLOSED', 'PARTIALLY_CLOSED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ROAD SEGMENTS TABLE
CREATE TABLE IF NOT EXISTS `road_segments` (
  `segment_id` VARCHAR(36) PRIMARY KEY,
  `segment_code` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `length_meters` DECIMAL(10,2) DEFAULT '500.00',
  `surface_type` VARCHAR(50) DEFAULT 'BITUMEN',
  `condition` VARCHAR(50) DEFAULT 'GOOD',
  `status` VARCHAR(50) DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rseg_road` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ROAD POTHOLES TABLE
CREATE TABLE IF NOT EXISTS `road_potholes` (
  `pothole_id` VARCHAR(36) PRIMARY KEY,
  `pothole_number` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `length_meters` DECIMAL(6,2) NOT NULL DEFAULT '1.50',
  `width_meters` DECIMAL(6,2) NOT NULL DEFAULT '1.00',
  `depth_meters` DECIMAL(6,2) NOT NULL DEFAULT '0.15',
  `estimated_volume_m3` DECIMAL(8,4) NOT NULL DEFAULT '0.2250',
  `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `status` ENUM('REPORTED', 'INSPECTION_PENDING', 'CONFIRMED', 'WORK_ASSIGNED', 'REPAIRED', 'VERIFIED', 'CLOSED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pot_road` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ROAD REPAIRS TABLE
CREATE TABLE IF NOT EXISTS `road_repairs` (
  `repair_id` VARCHAR(36) PRIMARY KEY,
  `repair_number` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `pothole_id` VARCHAR(36) DEFAULT NULL,
  `work_order_id` VARCHAR(36) DEFAULT 'WO-2026-314274',
  `repair_type` ENUM('POTHOLE_REPAIR', 'PATCH_WORK', 'RESURFACING', 'RECONSTRUCTION') DEFAULT 'POTHOLE_REPAIR',
  `progress_percentage` INT DEFAULT 0,
  `status` ENUM('PLANNED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED') DEFAULT 'IN_PROGRESS',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rrep_road` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. FOOTPATHS TABLE
CREATE TABLE IF NOT EXISTS `footpaths` (
  `footpath_id` VARCHAR(36) PRIMARY KEY,
  `footpath_code` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `length_meters` DECIMAL(10,2) DEFAULT '1500.00',
  `surface_type` ENUM('PAVER', 'CONCRETE', 'TILE') DEFAULT 'PAVER',
  `condition` ENUM('GOOD', 'FAIR', 'POOR', 'DAMAGED') DEFAULT 'GOOD',
  `status` ENUM('ACTIVE', 'UNDER_REPAIR') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fp_road` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ROAD CUTTING APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS `road_cutting_applications` (
  `application_id` VARCHAR(36) PRIMARY KEY,
  `application_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `agency` VARCHAR(150) NOT NULL,
  `purpose` TEXT NOT NULL,
  `cut_length_meters` DECIMAL(8,2) NOT NULL DEFAULT '50.00',
  `cut_width_meters` DECIMAL(8,2) NOT NULL DEFAULT '1.20',
  `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'RESTORED', 'CLOSED') DEFAULT 'SUBMITTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rcut_road` FOREIGN KEY (`road_id`) REFERENCES `roads` (`road_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TRAFFIC SIGNALS TABLE
CREATE TABLE IF NOT EXISTS `traffic_signals` (
  `signal_id` VARCHAR(36) PRIMARY KEY,
  `signal_code` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `location_name` VARCHAR(150) NOT NULL,
  `status` ENUM('NORMAL', 'FAULT', 'MAINTENANCE', 'OFFLINE') DEFAULT 'NORMAL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ROAD BLACK SPOTS TABLE
CREATE TABLE IF NOT EXISTS `road_black_spots` (
  `blackspot_id` VARCHAR(36) PRIMARY KEY,
  `blackspot_code` VARCHAR(50) UNIQUE NOT NULL,
  `road_id` VARCHAR(36) NOT NULL,
  `incident_count` INT DEFAULT 4,
  `risk_level` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'HIGH',
  `status` ENUM('ACTIVE', 'MITIGATED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SEED DEMO ROAD DATA
INSERT INTO `roads` (`road_id`, `road_code`, `corporation_id`, `ward_id`, `road_name`, `road_type`, `surface_type`, `length_meters`, `condition`, `status`) VALUES
('road-001', 'ROAD-2026-000001', 'c-demo-001', 'w-demo-024', 'Civil Lines Main Road Ward 24', 'MAIN_ROAD', 'BITUMEN', 2500.00, 'GOOD', 'ACTIVE')
ON DUPLICATE KEY UPDATE `road_name` = VALUES(`road_name`);

INSERT INTO `road_segments` (`segment_id`, `segment_code`, `road_id`, `length_meters`, `surface_type`, `condition`, `status`) VALUES
('rseg-001', 'RSEG-2026-000001', 'road-001', 500.00, 'BITUMEN', 'GOOD', 'ACTIVE')
ON DUPLICATE KEY UPDATE `segment_code` = VALUES(`segment_code`);

INSERT INTO `road_potholes` (`pothole_id`, `pothole_number`, `road_id`, `ward_id`, `length_meters`, `width_meters`, `depth_meters`, `estimated_volume_m3`, `severity`, `status`) VALUES
('pot-001', 'POT-2026-000001', 'road-001', 'w-demo-024', 1.50, 1.00, 0.15, 0.2250, 'MEDIUM', 'REPORTED')
ON DUPLICATE KEY UPDATE `pothole_number` = VALUES(`pothole_number`);

INSERT INTO `footpaths` (`footpath_id`, `footpath_code`, `road_id`, `ward_id`, `length_meters`, `surface_type`, `condition`, `status`) VALUES
('fp-001', 'FP-2026-000001', 'road-001', 'w-demo-024', 1500.00, 'PAVER', 'GOOD', 'ACTIVE')
ON DUPLICATE KEY UPDATE `footpath_code` = VALUES(`footpath_code`);

INSERT INTO `road_cutting_applications` (`application_id`, `application_number`, `corporation_id`, `ward_id`, `road_id`, `agency`, `purpose`, `cut_length_meters`, `cut_width_meters`, `status`) VALUES
('rcut-001', 'RCUT-2026-000001', 'c-demo-001', 'w-demo-024', 'road-001', 'MSEDCL Electricity', 'Underground High-Tension Cable Laying', 60.00, 1.20, 'APPROVED')
ON DUPLICATE KEY UPDATE `application_number` = VALUES(`application_number`);

INSERT INTO `traffic_signals` (`signal_id`, `signal_code`, `road_id`, `ward_id`, `location_name`, `status`) VALUES
('sig-001', 'SIG-2026-000001', 'road-001', 'w-demo-024', 'Civil Lines Square Ward 24', 'NORMAL')
ON DUPLICATE KEY UPDATE `location_name` = VALUES(`location_name`);

INSERT INTO `road_black_spots` (`blackspot_id`, `blackspot_code`, `road_id`, `incident_count`, `risk_level`, `status`) VALUES
('blk-001', 'BS-2026-000001', 'road-001', 4, 'HIGH', 'ACTIVE')
ON DUPLICATE KEY UPDATE `blackspot_code` = VALUES(`blackspot_code`);

SET FOREIGN_KEY_CHECKS = 1;
