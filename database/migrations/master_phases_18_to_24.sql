-- =============================================================================
-- MASTER MIGRATION: PHASES 18 TO 24 SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- PHASE 18: BUILDING PERMISSION / BPMS / TOWN PLANNING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `building_applications` (
  `bp_application_id` VARCHAR(36) PRIMARY KEY,
  `bp_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `applicant_name` VARCHAR(150) NOT NULL,
  `architect_name` VARCHAR(150) NOT NULL,
  `plot_number` VARCHAR(100) NOT NULL,
  `cts_number` VARCHAR(100) NOT NULL,
  `building_type` ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'MIXED_USE') DEFAULT 'RESIDENTIAL',
  `total_builtup_sqft` DECIMAL(10,2) DEFAULT 2500.00,
  `scrutiny_fee_amount` DECIMAL(10,2) DEFAULT 15000.00,
  `fee_payment_status` ENUM('PENDING', 'PAID', 'REFUNDED') DEFAULT 'PAID',
  `stage` ENUM('SUBMITTED', 'NOC_VERIFICATION', 'PLINTH_INSPECTION', 'APPROVED', 'REJECTED') DEFAULT 'SUBMITTED',
  `status` ENUM('ACTIVE', 'APPROVED', 'REJECTED', 'COMMENCEMENT_ISSUED', 'OCCUPANCY_ISSUED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `building_nocs` (
  `noc_id` VARCHAR(36) PRIMARY KEY,
  `bp_application_id` VARCHAR(36) NOT NULL,
  `noc_type` ENUM('FIRE', 'WATER', 'DRAINAGE', 'ROAD') NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  `issued_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bnoc_app` FOREIGN KEY (`bp_application_id`) REFERENCES `building_applications` (`bp_application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 19: PROPERTY, LAND, ESTATE & ENCROACHMENT MANAGEMENT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `municipal_properties` (
  `property_id` VARCHAR(36) PRIMARY KEY,
  `property_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `property_name` VARCHAR(150) NOT NULL,
  `land_area_sqft` DECIMAL(10,2) DEFAULT 10000.00,
  `lease_status` ENUM('VACANT', 'LEASED', 'SELF_USED', 'ENCROACHED') DEFAULT 'SELF_USED',
  `monthly_rent` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `encroachments` (
  `encroachment_id` VARCHAR(36) PRIMARY KEY,
  `encroachment_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'HIGH',
  `notice_status` ENUM('REPORTED', 'NOTICE_ISSUED', 'HEARING', 'DEMOLITION_SCHEDULED', 'CLEARED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 20: FIRE, EMERGENCY & DISASTER MANAGEMENT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fire_stations` (
  `station_id` VARCHAR(36) PRIMARY KEY,
  `station_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `station_name` VARCHAR(150) NOT NULL,
  `vehicles_count` INT DEFAULT 4,
  `staff_count` INT DEFAULT 20,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fire_noc_applications` (
  `fnoc_id` VARCHAR(36) PRIMARY KEY,
  `fnoc_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `building_name` VARCHAR(150) NOT NULL,
  `risk_category` ENUM('LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK') DEFAULT 'MEDIUM_RISK',
  `status` ENUM('SUBMITTED', 'INSPECTED', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `emergency_incidents` (
  `incident_id` VARCHAR(36) PRIMARY KEY,
  `incident_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `incident_type` ENUM('FIRE_OUTBREAK', 'BUILDING_COLLAPSE', 'FLOODING', 'HAZMAT') DEFAULT 'FIRE_OUTBREAK',
  `location` VARCHAR(255) NOT NULL,
  `status` ENUM('REPORTED', 'DISPATCHED', 'ON_SITE', 'CONTROLLED', 'RESOLVED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 21: ENVIRONMENT, GARDEN & TREE CENSUS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `municipal_gardens` (
  `garden_id` VARCHAR(36) PRIMARY KEY,
  `garden_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `garden_name` VARCHAR(150) NOT NULL,
  `area_acres` DECIMAL(5,2) DEFAULT 2.50,
  `status` ENUM('OPEN', 'MAINTENANCE', 'CLOSED') DEFAULT 'OPEN',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tree_census` (
  `tree_id` VARCHAR(36) PRIMARY KEY,
  `tree_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `species_name` VARCHAR(150) NOT NULL,
  `girth_cm` INT DEFAULT 45,
  `health_status` ENUM('HEALTHY', 'DISEASED', 'DANGEROUS', 'DEAD') DEFAULT 'HEALTHY',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tree_cutting_permits` (
  `permit_id` VARCHAR(36) PRIMARY KEY,
  `permit_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `applicant_name` VARCHAR(150) NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `status` ENUM('SUBMITTED', 'INSPECTED', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 22: PARKING & TRAFFIC ENFORCEMENT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `parking_lots` (
  `lot_id` VARCHAR(36) PRIMARY KEY,
  `lot_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `lot_name` VARCHAR(150) NOT NULL,
  `total_capacity` INT DEFAULT 100,
  `occupied_slots` INT DEFAULT 35,
  `hourly_rate` DECIMAL(8,2) DEFAULT 20.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `traffic_challans` (
  `challan_id` VARCHAR(36) PRIMARY KEY,
  `challan_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `vehicle_number` VARCHAR(30) NOT NULL,
  `violation_type` ENUM('NO_PARKING', 'SIGNAL_JUMP', 'OVER_SPEED', 'OBSTRUCTION') DEFAULT 'NO_PARKING',
  `fine_amount` DECIMAL(8,2) DEFAULT 500.00,
  `payment_status` ENUM('UNPAID', 'PAID', 'CANCELLED') DEFAULT 'UNPAID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 23: SMART CITY IoT SENSORS & COMMAND CENTRE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `iot_devices` (
  `device_id` VARCHAR(36) PRIMARY KEY,
  `device_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `device_name` VARCHAR(150) NOT NULL,
  `device_type` ENUM('WATER_LEVEL', 'AIR_QUALITY', 'SMART_STREETLIGHT', 'SMART_BIN') DEFAULT 'WATER_LEVEL',
  `battery_pct` INT DEFAULT 95,
  `operating_status` ENUM('ONLINE', 'OFFLINE', 'MAINTENANCE', 'ALERT') DEFAULT 'ONLINE',
  `last_ping` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PHASE 24: EXECUTIVE MIS & ANALYTICS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `executive_mis_summaries` (
  `summary_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `report_date` DATE NOT NULL,
  `total_revenue` DECIMAL(12,2) DEFAULT 2500000.00,
  `complaints_resolved_pct` DECIMAL(5,2) DEFAULT 94.50,
  `overall_health_score` INT DEFAULT 92,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- SEED DEMO DATA FOR PHASES 18 TO 24
-- -----------------------------------------------------------------------------
INSERT INTO `building_applications` (`bp_application_id`, `bp_number`, `corporation_id`, `ward_id`, `applicant_name`, `architect_name`, `plot_number`, `cts_number`, `building_type`, `total_builtup_sqft`, `stage`, `status`) VALUES
('bp-001', 'BP-2026-000001', 'c-demo-001', 'w-demo-024', 'Ramesh Sharma', 'Shree Architects Ward 24', 'Plot 45', 'CTS-8842', 'RESIDENTIAL', 3200.00, 'APPROVED', 'COMMENCEMENT_ISSUED')
ON DUPLICATE KEY UPDATE `bp_number` = VALUES(`bp_number`);

INSERT INTO `municipal_properties` (`property_id`, `property_code`, `corporation_id`, `ward_id`, `property_name`, `land_area_sqft`, `lease_status`, `monthly_rent`) VALUES
('est-001', 'EST-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Municipal Shopping Complex', 15000.00, 'LEASED', 45000.00)
ON DUPLICATE KEY UPDATE `property_code` = VALUES(`property_code`);

INSERT INTO `encroachments` (`encroachment_id`, `encroachment_code`, `corporation_id`, `ward_id`, `location`, `severity`, `notice_status`) VALUES
('enc-001', 'ENC-2026-000001', 'c-demo-001', 'w-demo-024', 'Civil Lines Road Margin Sector 2', 'HIGH', 'NOTICE_ISSUED')
ON DUPLICATE KEY UPDATE `encroachment_code` = VALUES(`encroachment_code`);

INSERT INTO `fire_stations` (`station_id`, `station_code`, `corporation_id`, `ward_id`, `station_name`, `vehicles_count`, `staff_count`) VALUES
('fs-001', 'FS-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Central Fire Station', 6, 28)
ON DUPLICATE KEY UPDATE `station_code` = VALUES(`station_code`);

INSERT INTO `fire_noc_applications` (`fnoc_id`, `fnoc_number`, `corporation_id`, `building_name`, `risk_category`, `status`) VALUES
('fnoc-001', 'FNOC-2026-000001', 'c-demo-001', 'Shivaji Heights Commercial Complex', 'HIGH_RISK', 'APPROVED')
ON DUPLICATE KEY UPDATE `fnoc_number` = VALUES(`fnoc_number`);

INSERT INTO `municipal_gardens` (`garden_id`, `garden_code`, `corporation_id`, `ward_id`, `garden_name`, `area_acres`, `status`) VALUES
('gdn-001', 'GDN-2026-000001', 'c-demo-001', 'w-demo-024', 'Jijau Udyan Municipal Park', 4.20, 'OPEN')
ON DUPLICATE KEY UPDATE `garden_code` = VALUES(`garden_code`);

INSERT INTO `tree_census` (`tree_id`, `tree_code`, `corporation_id`, `ward_id`, `species_name`, `girth_cm`, `health_status`) VALUES
('tree-001', 'TREE-2026-000001', 'c-demo-001', 'w-demo-024', 'Heritage Banyan Tree', 120, 'HEALTHY')
ON DUPLICATE KEY UPDATE `tree_code` = VALUES(`tree_code`);

INSERT INTO `parking_lots` (`lot_id`, `lot_code`, `corporation_id`, `ward_id`, `lot_name`, `total_capacity`, `occupied_slots`, `hourly_rate`) VALUES
('prk-001', 'PRK-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Station Road Multi-Level Parking', 150, 42, 20.00)
ON DUPLICATE KEY UPDATE `lot_code` = VALUES(`lot_code`);

INSERT INTO `traffic_challans` (`challan_id`, `challan_number`, `corporation_id`, `vehicle_number`, `violation_type`, `fine_amount`, `payment_status`) VALUES
('chl-001', 'CHL-2026-000001', 'c-demo-001', 'MH-20-AB-1234', 'NO_PARKING', 500.00, 'UNPAID')
ON DUPLICATE KEY UPDATE `challan_number` = VALUES(`challan_number`);

INSERT INTO `iot_devices` (`device_id`, `device_code`, `corporation_id`, `ward_id`, `device_name`, `device_type`, `battery_pct`, `operating_status`) VALUES
('iot-001', 'IOT-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Drainage Flood Level Sensor 1', 'WATER_LEVEL', 98, 'ONLINE')
ON DUPLICATE KEY UPDATE `device_code` = VALUES(`device_code`);

INSERT INTO `executive_mis_summaries` (`summary_id`, `corporation_id`, `report_date`, `total_revenue`, `complaints_resolved_pct`, `overall_health_score`) VALUES
('mis-001', 'c-demo-001', CURDATE(), 4850000.00, 96.80, 95)
ON DUPLICATE KEY UPDATE `summary_id` = VALUES(`summary_id`);

SET FOREIGN_KEY_CHECKS = 1;
