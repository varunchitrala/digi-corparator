-- =============================================================================
-- PHASE 13: PROPERTY TAX, WATER TAX, BILLING & REVENUE MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. PROPERTIES MASTER TABLE
CREATE TABLE IF NOT EXISTS `properties` (
  `property_id` VARCHAR(36) PRIMARY KEY,
  `property_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `zone_id` VARCHAR(36) DEFAULT 'ZONE-001',
  `owner_name` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `property_type` ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'MIXED', 'INSTITUTIONAL', 'VACANT') DEFAULT 'RESIDENTIAL',
  `usage_type` VARCHAR(100) DEFAULT 'Residential Flat',
  `plot_area` DECIMAL(10,2) NOT NULL DEFAULT '1000.00',
  `built_up_area` DECIMAL(10,2) NOT NULL DEFAULT '850.00',
  `address` TEXT NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT '19.87620000',
  `longitude` DECIMAL(11,8) DEFAULT '75.34330000',
  `status` ENUM('ACTIVE', 'INACTIVE', 'MUTATED', 'DEMOLISHED') DEFAULT 'ACTIVE',
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PROPERTY OWNERSHIP HISTORY TABLE
CREATE TABLE IF NOT EXISTS `property_ownership_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `property_id` VARCHAR(36) NOT NULL,
  `old_owner` VARCHAR(150) NOT NULL,
  `new_owner` VARCHAR(150) NOT NULL,
  `transfer_date` DATE NOT NULL,
  `reason` TEXT DEFAULT NULL,
  `approved_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_poh_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROPERTY ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS `property_assessments` (
  `assessment_id` VARCHAR(36) PRIMARY KEY,
  `assessment_number` VARCHAR(50) UNIQUE NOT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `assessment_type` ENUM('NEW', 'REASSESSMENT', 'MUTATION', 'ANNUAL') DEFAULT 'ANNUAL',
  `taxable_value` DECIMAL(15,2) NOT NULL DEFAULT '120000.00',
  `effective_from` DATE NOT NULL,
  `status` ENUM('DRAFT', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pass_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TAX DEMANDS TABLE
CREATE TABLE IF NOT EXISTS `tax_demands` (
  `demand_id` VARCHAR(36) PRIMARY KEY,
  `demand_number` VARCHAR(50) UNIQUE NOT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `financial_year` VARCHAR(20) NOT NULL DEFAULT '2026-2027',
  `base_amount` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `penalty` DECIMAL(15,2) DEFAULT '0.00',
  `rebate` DECIMAL(15,2) DEFAULT '0.00',
  `arrears` DECIMAL(15,2) DEFAULT '0.00',
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `paid_amount` DECIMAL(15,2) DEFAULT '0.00',
  `outstanding_amount` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `due_date` DATE NOT NULL,
  `status` ENUM('GENERATED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'GENERATED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tdem_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BILLS MASTER TABLE
CREATE TABLE IF NOT EXISTS `bills` (
  `bill_id` VARCHAR(36) PRIMARY KEY,
  `bill_number` VARCHAR(50) UNIQUE NOT NULL,
  `demand_id` VARCHAR(36) DEFAULT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `bill_type` ENUM('PROPERTY_TAX', 'WATER_TAX', 'COMPOSITE') DEFAULT 'PROPERTY_TAX',
  `billing_period` VARCHAR(50) NOT NULL DEFAULT 'FY 2026-2027',
  `subtotal` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `arrears` DECIMAL(15,2) DEFAULT '0.00',
  `penalty` DECIMAL(15,2) DEFAULT '0.00',
  `rebate` DECIMAL(15,2) DEFAULT '0.00',
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `paid_amount` DECIMAL(15,2) DEFAULT '0.00',
  `outstanding_amount` DECIMAL(15,2) NOT NULL DEFAULT '12000.00',
  `due_date` DATE NOT NULL,
  `status` ENUM('DRAFT', 'GENERATED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'GENERATED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bill_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. REVENUE LEDGER TABLE
CREATE TABLE IF NOT EXISTS `revenue_ledger` (
  `ledger_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `bill_id` VARCHAR(36) DEFAULT NULL,
  `transaction_type` ENUM('DEMAND', 'PAYMENT', 'REBATE', 'PENALTY', 'ADJUSTMENT') NOT NULL,
  `debit` DECIMAL(15,2) DEFAULT '0.00',
  `credit` DECIMAL(15,2) DEFAULT '0.00',
  `balance` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rled_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. WATER CONNECTIONS MASTER TABLE
CREATE TABLE IF NOT EXISTS `water_connections` (
  `connection_id` VARCHAR(36) PRIMARY KEY,
  `connection_number` VARCHAR(50) UNIQUE NOT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `connection_type` ENUM('DOMESTIC', 'COMMERCIAL', 'INDUSTRIAL') DEFAULT 'DOMESTIC',
  `meter_number` VARCHAR(50) UNIQUE NOT NULL,
  `last_reading` DECIMAL(10,2) DEFAULT '100.00',
  `status` ENUM('ACTIVE', 'INACTIVE', 'DISCONNECTED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wconn_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WATER METER READINGS TABLE
CREATE TABLE IF NOT EXISTS `water_meter_readings` (
  `reading_id` VARCHAR(36) PRIMARY KEY,
  `connection_id` VARCHAR(36) NOT NULL,
  `previous_reading` DECIMAL(10,2) NOT NULL,
  `current_reading` DECIMAL(10,2) NOT NULL,
  `consumption` DECIMAL(10,2) NOT NULL,
  `reading_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wread_conn` FOREIGN KEY (`connection_id`) REFERENCES `water_connections` (`connection_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TAX CLEARANCE CERTIFICATES TABLE (QR Verified)
CREATE TABLE IF NOT EXISTS `tax_clearance_certificates` (
  `certificate_id` VARCHAR(36) PRIMARY KEY,
  `certificate_number` VARCHAR(50) UNIQUE NOT NULL,
  `property_id` VARCHAR(36) NOT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `issue_date` DATE NOT NULL,
  `valid_until` DATE NOT NULL,
  `status` ENUM('VALID', 'EXPIRED', 'REVOKED') DEFAULT 'VALID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tcc_prop` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SEED DEMO PROPERTIES, WATER CONNECTIONS, DEMANDS & BILLS
INSERT INTO `properties` (`property_id`, `property_number`, `corporation_id`, `ward_id`, `owner_name`, `mobile`, `email`, `property_type`, `usage_type`, `plot_area`, `built_up_area`, `address`, `created_by_id`) VALUES
('prop-001', 'PROP-2026-000001', 'c-demo-001', 'w-demo-024', 'Ramesh Patil', '9822011445', 'ramesh.patil@gmail.com', 'RESIDENTIAL', 'Residential Flat', 1200.00, 950.00, 'Plot 45 Civil Lines Ward 24', 'u-corp-001')
ON DUPLICATE KEY UPDATE `owner_name` = VALUES(`owner_name`);

INSERT INTO `tax_demands` (`demand_id`, `demand_number`, `property_id`, `financial_year`, `base_amount`, `total_amount`, `outstanding_amount`, `due_date`, `status`) VALUES
('dem-001', 'DEM-2026-000001', 'prop-001', '2026-2027', 12000.00, 12000.00, 12000.00, '2026-09-30', 'GENERATED')
ON DUPLICATE KEY UPDATE `base_amount` = VALUES(`base_amount`);

INSERT INTO `bills` (`bill_id`, `bill_number`, `demand_id`, `property_id`, `bill_type`, `billing_period`, `subtotal`, `total_amount`, `outstanding_amount`, `due_date`, `status`) VALUES
('bill-001', 'BILL-2026-000001', 'dem-001', 'prop-001', 'PROPERTY_TAX', 'FY 2026-2027', 12000.00, 12000.00, 12000.00, '2026-09-30', 'GENERATED')
ON DUPLICATE KEY UPDATE `subtotal` = VALUES(`subtotal`);

INSERT INTO `water_connections` (`connection_id`, `connection_number`, `property_id`, `owner_name`, `connection_type`, `meter_number`, `last_reading`) VALUES
('wconn-001', 'WTR-2026-000001', 'prop-001', 'Ramesh Patil', 'DOMESTIC', 'WM-889900', 100.00)
ON DUPLICATE KEY UPDATE `owner_name` = VALUES(`owner_name`);

SET FOREIGN_KEY_CHECKS = 1;
