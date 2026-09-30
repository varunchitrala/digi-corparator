-- =============================================================================
-- PHASE 17: PUBLIC HEALTH, MEDICAL SERVICES & SURVEILLANCE SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. HEALTH FACILITIES MASTER TABLE
CREATE TABLE IF NOT EXISTS `health_facilities` (
  `facility_id` VARCHAR(36) PRIMARY KEY,
  `facility_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `facility_name` VARCHAR(150) NOT NULL,
  `facility_type` ENUM('MUNICIPAL_HOSPITAL', 'URBAN_HEALTH_CENTRE', 'DISPENSARY', 'MATERNITY_CENTRE', 'LABORATORY') DEFAULT 'URBAN_HEALTH_CENTRE',
  `capacity_beds` INT DEFAULT 20,
  `operating_status` ENUM('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'EMERGENCY_ONLY') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. HEALTH SERVICES MASTER TABLE
CREATE TABLE IF NOT EXISTS `health_services` (
  `service_id` VARCHAR(36) PRIMARY KEY,
  `service_code` VARCHAR(50) UNIQUE NOT NULL,
  `facility_id` VARCHAR(36) NOT NULL,
  `service_name` VARCHAR(150) NOT NULL,
  `service_category` ENUM('OUTPATIENT', 'MATERNAL_HEALTH', 'CHILD_HEALTH', 'IMMUNIZATION', 'LABORATORY') DEFAULT 'OUTPATIENT',
  `eligibility` VARCHAR(150) DEFAULT 'ALL_CITIZENS',
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hsvc_fac` FOREIGN KEY (`facility_id`) REFERENCES `health_facilities` (`facility_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. HEALTH VISITS TABLE
CREATE TABLE IF NOT EXISTS `health_visits` (
  `visit_id` VARCHAR(36) PRIMARY KEY,
  `visit_number` VARCHAR(50) UNIQUE NOT NULL,
  `beneficiary_code` VARCHAR(50) NOT NULL,
  `facility_id` VARCHAR(36) NOT NULL,
  `service_id` VARCHAR(36) NOT NULL,
  `visit_date` DATE NOT NULL,
  `status` ENUM('REGISTERED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hvis_fac` FOREIGN KEY (`facility_id`) REFERENCES `health_facilities` (`facility_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. HEALTH CAMPS TABLE
CREATE TABLE IF NOT EXISTS `health_camps` (
  `camp_id` VARCHAR(36) PRIMARY KEY,
  `camp_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `camp_name` VARCHAR(150) NOT NULL,
  `camp_type` ENUM('HEALTH_SCREENING', 'IMMUNIZATION', 'MATERNAL_HEALTH', 'EYE_CAMP') DEFAULT 'HEALTH_SCREENING',
  `camp_date` DATE NOT NULL,
  `status` ENUM('PLANNED', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'SCHEDULED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DISEASE SURVEILLANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS `health_surveillance_records` (
  `surveillance_id` VARCHAR(36) PRIMARY KEY,
  `surveillance_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `condition_category` ENUM('VECTOR_BORNE', 'WATER_BORNE', 'FOOD_BORNE', 'RESPIRATORY') DEFAULT 'VECTOR_BORNE',
  `case_count` INT NOT NULL DEFAULT 5,
  `severity_category` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `status` ENUM('REPORTED', 'UNDER_REVIEW', 'VERIFIED', 'MONITORING', 'RESOLVED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BREEDING SPOTS TABLE
CREATE TABLE IF NOT EXISTS `breeding_spots` (
  `spot_id` VARCHAR(36) PRIMARY KEY,
  `spot_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `source_type` ENUM('STAGNANT_WATER', 'OPEN_DRAIN', 'WATER_TANK', 'CONSTRUCTION_SITE') DEFAULT 'STAGNANT_WATER',
  `risk_level` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'HIGH',
  `status` ENUM('REPORTED', 'INSPECTED', 'TREATED', 'VERIFIED', 'CLOSED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. FOGGING ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS `fogging_activities` (
  `fogging_id` VARCHAR(36) PRIMARY KEY,
  `fogging_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `fogging_date` DATE NOT NULL,
  `route_name` VARCHAR(150) NOT NULL DEFAULT 'Ward 24 Civil Lines Sector 3',
  `status` ENUM('PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PLANNED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. FOOD INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `food_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `inspection_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `establishment_name` VARCHAR(150) NOT NULL,
  `hygiene_score` INT DEFAULT 85,
  `result` ENUM('COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'CRITICAL') DEFAULT 'COMPLIANT',
  `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FOLLOW_UP_REQUIRED') DEFAULT 'COMPLETED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. HEALTH INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS `health_incidents` (
  `incident_id` VARCHAR(36) PRIMARY KEY,
  `incident_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `incident_type` ENUM('DISEASE_ALERT', 'FOOD_SAFETY', 'WATER_HEALTH_RISK', 'VECTOR_RISK') DEFAULT 'DISEASE_ALERT',
  `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `status` ENUM('REPORTED', 'UNDER_REVIEW', 'RESPONSE_ACTIVE', 'RESOLVED') DEFAULT 'REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SEED DEMO PUBLIC HEALTH DATA
INSERT INTO `health_facilities` (`facility_id`, `facility_code`, `corporation_id`, `ward_id`, `facility_name`, `facility_type`, `capacity_beds`, `operating_status`) VALUES
('hf-001', 'HF-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Primary Urban Health Centre', 'URBAN_HEALTH_CENTRE', 25, 'ACTIVE')
ON DUPLICATE KEY UPDATE `facility_name` = VALUES(`facility_name`);

INSERT INTO `health_services` (`service_id`, `service_code`, `facility_id`, `service_name`, `service_category`, `eligibility`, `status`) VALUES
('hsvc-001', 'HSVC-2026-000001', 'hf-001', 'Maternal & Child Immunization Care', 'IMMUNIZATION', 'ALL_CITIZENS', 'ACTIVE')
ON DUPLICATE KEY UPDATE `service_name` = VALUES(`service_name`);

INSERT INTO `health_camps` (`camp_id`, `camp_code`, `corporation_id`, `ward_id`, `camp_name`, `camp_type`, `camp_date`, `status`) VALUES
('camp-001', 'CAMP-2026-000001', 'c-demo-001', 'w-demo-024', 'Ward 24 Monsoon Vector Control & Dengue Camp', 'HEALTH_SCREENING', CURDATE(), 'SCHEDULED')
ON DUPLICATE KEY UPDATE `camp_name` = VALUES(`camp_name`);

INSERT INTO `health_surveillance_records` (`surveillance_id`, `surveillance_number`, `corporation_id`, `ward_id`, `condition_category`, `case_count`, `severity_category`, `status`) VALUES
('dsr-001', 'DSR-2026-000001', 'c-demo-001', 'w-demo-024', 'VECTOR_BORNE', 8, 'MEDIUM', 'REPORTED')
ON DUPLICATE KEY UPDATE `surveillance_number` = VALUES(`surveillance_number`);

INSERT INTO `breeding_spots` (`spot_id`, `spot_code`, `corporation_id`, `ward_id`, `source_type`, `risk_level`, `status`) VALUES
('spot-001', 'SPOT-2026-000001', 'c-demo-001', 'w-demo-024', 'STAGNANT_WATER', 'HIGH', 'REPORTED')
ON DUPLICATE KEY UPDATE `spot_code` = VALUES(`spot_code`);

INSERT INTO `fogging_activities` (`fogging_id`, `fogging_number`, `corporation_id`, `ward_id`, `fogging_date`, `route_name`, `status`) VALUES
('fog-001', 'FOG-2026-000001', 'c-demo-001', 'w-demo-024', CURDATE(), 'Ward 24 Civil Lines Sector 3', 'PLANNED')
ON DUPLICATE KEY UPDATE `fogging_number` = VALUES(`fogging_number`);

INSERT INTO `food_inspections` (`inspection_id`, `inspection_number`, `corporation_id`, `ward_id`, `establishment_name`, `hygiene_score`, `result`, `status`) VALUES
('finsp-001', 'FINSP-2026-000001', 'c-demo-001', 'w-demo-024', 'Rajesh Sweets & Restaurant Ward 24', 88, 'COMPLIANT', 'COMPLETED')
ON DUPLICATE KEY UPDATE `inspection_number` = VALUES(`inspection_number`);

INSERT INTO `health_incidents` (`incident_id`, `incident_number`, `corporation_id`, `ward_id`, `incident_type`, `severity`, `status`) VALUES
('hinc-001', 'HINC-2026-000001', 'c-demo-001', 'w-demo-024', 'VECTOR_RISK', 'MEDIUM', 'REPORTED')
ON DUPLICATE KEY UPDATE `incident_number` = VALUES(`incident_number`);

SET FOREIGN_KEY_CHECKS = 1;
