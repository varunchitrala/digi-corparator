-- =============================================================================
-- PHASE 15: WATER SUPPLY, DRAINAGE, SEWERAGE & PUBLIC UTILITY SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. WATER SOURCES TABLE
CREATE TABLE IF NOT EXISTS `water_sources` (
  `source_id` VARCHAR(36) PRIMARY KEY,
  `source_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `source_name` VARCHAR(150) NOT NULL,
  `source_type` ENUM('DAM', 'RIVER', 'LAKE', 'BOREWELL', 'RESERVOIR') DEFAULT 'DAM',
  `capacity_mld` DECIMAL(10,2) NOT NULL DEFAULT '250.00',
  `current_level_percent` INT DEFAULT 82,
  `status` ENUM('ACTIVE', 'INACTIVE', 'LOW_LEVEL', 'UNDER_MAINTENANCE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WATER TREATMENT PLANTS TABLE
CREATE TABLE IF NOT EXISTS `water_treatment_plants` (
  `plant_id` VARCHAR(36) PRIMARY KEY,
  `plant_code` VARCHAR(50) UNIQUE NOT NULL,
  `source_id` VARCHAR(36) NOT NULL,
  `plant_name` VARCHAR(150) NOT NULL,
  `capacity_mld` DECIMAL(10,2) NOT NULL DEFAULT '150.00',
  `current_output_mld` DECIMAL(10,2) NOT NULL DEFAULT '142.00',
  `status` ENUM('ACTIVE', 'PARTIAL', 'SHUTDOWN', 'MAINTENANCE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wtp_src` FOREIGN KEY (`source_id`) REFERENCES `water_sources` (`source_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. WATER PIPELINES TABLE
CREATE TABLE IF NOT EXISTS `water_pipelines` (
  `pipeline_id` VARCHAR(36) PRIMARY KEY,
  `pipeline_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `pipeline_name` VARCHAR(150) NOT NULL,
  `pipeline_type` ENUM('TRANSMISSION', 'PRIMARY', 'SECONDARY', 'DISTRIBUTION') DEFAULT 'DISTRIBUTION',
  `material` VARCHAR(50) DEFAULT 'DI',
  `diameter_mm` INT DEFAULT 300,
  `length_meters` DECIMAL(10,2) DEFAULT '1200.00',
  `status` ENUM('ACTIVE', 'INACTIVE', 'UNDER_REPAIR') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. WATER VALVES TABLE
CREATE TABLE IF NOT EXISTS `water_valves` (
  `valve_id` VARCHAR(36) PRIMARY KEY,
  `valve_code` VARCHAR(50) UNIQUE NOT NULL,
  `pipeline_id` VARCHAR(36) NOT NULL,
  `valve_type` ENUM('GATE', 'BUTTERFLY', 'CHECK', 'CONTROL') DEFAULT 'GATE',
  `status` ENUM('OPEN', 'CLOSED', 'PARTIAL', 'FAULT') DEFAULT 'OPEN',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_val_pipe` FOREIGN KEY (`pipeline_id`) REFERENCES `water_pipelines` (`pipeline_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WATER VALVE HISTORY TABLE
CREATE TABLE IF NOT EXISTS `water_valve_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `valve_id` VARCHAR(36) NOT NULL,
  `old_position` VARCHAR(20) NOT NULL,
  `new_position` VARCHAR(20) NOT NULL,
  `operator_id` VARCHAR(36) NOT NULL,
  `reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vhist_val` FOREIGN KEY (`valve_id`) REFERENCES `water_valves` (`valve_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. WATER SUPPLY SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS `water_supply_schedules` (
  `schedule_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `zone_name` VARCHAR(100) NOT NULL DEFAULT 'Ward 24 Zone A',
  `supply_date` DATE NOT NULL,
  `start_time` TIME NOT NULL DEFAULT '06:00:00',
  `end_time` TIME NOT NULL DEFAULT '09:00:00',
  `status` ENUM('SCHEDULED', 'STARTED', 'COMPLETED', 'INTERRUPTED') DEFAULT 'SCHEDULED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. WATER LEAKAGES TABLE
CREATE TABLE IF NOT EXISTS `water_leakages` (
  `leakage_id` VARCHAR(36) PRIMARY KEY,
  `leakage_number` VARCHAR(50) UNIQUE NOT NULL,
  `pipeline_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `description` TEXT NOT NULL,
  `status` ENUM('REPORTED', 'INSPECTION_PENDING', 'CONFIRMED', 'WORK_ASSIGNED', 'IN_PROGRESS', 'REPAIRED', 'VERIFIED', 'CLOSED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_leak_pipe` FOREIGN KEY (`pipeline_id`) REFERENCES `water_pipelines` (`pipeline_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DRAINS TABLE
CREATE TABLE IF NOT EXISTS `drains` (
  `drain_id` VARCHAR(36) PRIMARY KEY,
  `drain_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `drain_type` ENUM('STORM_WATER', 'OPEN_DRAIN', 'CLOSED_DRAIN') DEFAULT 'STORM_WATER',
  `length_meters` DECIMAL(10,2) DEFAULT '800.00',
  `status` ENUM('GOOD', 'BLOCKED', 'DAMAGED') DEFAULT 'GOOD',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SEWER PIPELINES TABLE
CREATE TABLE IF NOT EXISTS `sewer_pipelines` (
  `sewer_id` VARCHAR(36) PRIMARY KEY,
  `sewer_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `pipe_type` ENUM('MAIN', 'SECONDARY', 'LATERAL') DEFAULT 'MAIN',
  `status` ENUM('ACTIVE', 'BLOCKED', 'UNDER_MAINTENANCE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. MANHOLES TABLE
CREATE TABLE IF NOT EXISTS `manholes` (
  `manhole_id` VARCHAR(36) PRIMARY KEY,
  `manhole_code` VARCHAR(50) UNIQUE NOT NULL,
  `sewer_id` VARCHAR(36) NOT NULL,
  `depth_meters` DECIMAL(5,2) DEFAULT '2.50',
  `cover_status` ENUM('INTACT', 'MISSING_COVER', 'DAMAGED') DEFAULT 'INTACT',
  `status` ENUM('NORMAL', 'BLOCKED', 'FLOODED') DEFAULT 'NORMAL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mh_sew` FOREIGN KEY (`sewer_id`) REFERENCES `sewer_pipelines` (`sewer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. STP FACILITIES TABLE
CREATE TABLE IF NOT EXISTS `stp_facilities` (
  `stp_id` VARCHAR(36) PRIMARY KEY,
  `stp_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `capacity_mld` DECIMAL(10,2) NOT NULL DEFAULT '80.00',
  `status` ENUM('ACTIVE', 'MAINTENANCE', 'SHUTDOWN') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. SEED DEMO UTILITY DATA
INSERT INTO `water_sources` (`source_id`, `source_code`, `corporation_id`, `source_name`, `capacity_mld`, `current_level_percent`) VALUES
('wsrc-001', 'WSRC-2026-000001', 'c-demo-001', 'Jayakwadi Dam Reservoir', 450.00, 85)
ON DUPLICATE KEY UPDATE `source_name` = VALUES(`source_name`);

INSERT INTO `water_pipelines` (`pipeline_id`, `pipeline_code`, `corporation_id`, `ward_id`, `pipeline_name`, `length_meters`) VALUES
('pipe-001', 'PIPE-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Main Distribution Pipeline', 1500.00)
ON DUPLICATE KEY UPDATE `pipeline_name` = VALUES(`pipeline_name`);

INSERT INTO `water_valves` (`valve_id`, `valve_code`, `pipeline_id`, `valve_type`, `status`) VALUES
('val-001', 'VAL-2026-000001', 'pipe-001', 'GATE', 'OPEN')
ON DUPLICATE KEY UPDATE `valve_type` = VALUES(`valve_type`);

INSERT INTO `water_supply_schedules` (`schedule_id`, `corporation_id`, `ward_id`, `zone_name`, `supply_date`, `start_time`, `end_time`, `status`) VALUES
('sch-001', 'c-demo-001', 'w-demo-024', 'Ward 24 Zone A Civil Lines', CURDATE(), '06:00:00', '09:00:00', 'SCHEDULED')
ON DUPLICATE KEY UPDATE `zone_name` = VALUES(`zone_name`);

INSERT INTO `water_leakages` (`leakage_id`, `leakage_number`, `pipeline_id`, `ward_id`, `severity`, `description`, `status`) VALUES
('leak-001', 'LEAK-2026-000001', 'pipe-001', 'w-demo-024', 'MEDIUM', 'Pipeline joint leakage near Plot 45', 'REPORTED')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

INSERT INTO `drains` (`drain_id`, `drain_code`, `corporation_id`, `ward_id`, `drain_type`, `length_meters`, `status`) VALUES
('drn-001', 'DRN-2026-000001', 'c-demo-001', 'w-demo-024', 'STORM_WATER', 1200.00, 'GOOD')
ON DUPLICATE KEY UPDATE `drain_code` = VALUES(`drain_code`);

INSERT INTO `sewer_pipelines` (`sewer_id`, `sewer_code`, `corporation_id`, `ward_id`, `pipe_type`, `status`) VALUES
('sew-001', 'SEW-2026-000001', 'c-demo-001', 'w-demo-024', 'MAIN', 'ACTIVE')
ON DUPLICATE KEY UPDATE `sewer_code` = VALUES(`sewer_code`);

INSERT INTO `manholes` (`manhole_id`, `manhole_code`, `sewer_id`, `depth_meters`, `status`) VALUES
('mh-001', 'MH-2026-000001', 'sew-001', 2.80, 'NORMAL')
ON DUPLICATE KEY UPDATE `manhole_code` = VALUES(`manhole_code`);

INSERT INTO `stp_facilities` (`stp_id`, `stp_code`, `corporation_id`, `name`, `capacity_mld`, `status`) VALUES
('stp-001', 'STP-2026-000001', 'c-demo-001', 'Chhatrapati Sambhajinagar STP Plant 1', 100.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
