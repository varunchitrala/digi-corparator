-- =============================================================================
-- PHASE 7: DEVELOPMENT WORKS & PROJECT MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ALTER WORKS TABLE ENUM AND COLUMNS
ALTER TABLE `works`
  MODIFY COLUMN `status` ENUM(
    'DRAFT', 'PROPOSED', 'ESTIMATE_PREPARED', 'TECHNICAL_APPROVAL_PENDING', 'TECHNICAL_APPROVED',
    'ADMIN_APPROVAL_PENDING', 'ADMIN_APPROVED', 'FINANCIAL_APPROVAL_PENDING', 'FINANCIAL_APPROVED',
    'TENDER_PENDING', 'TENDERED', 'CONTRACTOR_SELECTED', 'WORK_ORDER_ISSUED', 'NOT_STARTED',
    'ONGOING', 'ON_HOLD', 'DELAYED', 'COMPLETED', 'FINAL_INSPECTION', 'FINAL_APPROVED', 'CLOSED', 'CANCELLED'
  ) DEFAULT 'PROPOSED',
  ADD COLUMN IF NOT EXISTS `category_id` VARCHAR(36) DEFAULT NULL AFTER `department_id`,
  ADD COLUMN IF NOT EXISTS `source_type` ENUM('CORPORATOR_PROPOSAL', 'CITIZEN_COMPLAINT', 'CITIZEN_REQUEST', 'DEPARTMENT_PROPOSAL', 'CORPORATION_PLAN', 'COMMITTEE_RESOLUTION', 'GENERAL_BODY_RESOLUTION', 'EMERGENCY_REQUIREMENT', 'ANNUAL_DEVELOPMENT_PLAN', 'OTHER') DEFAULT 'CORPORATION_PLAN' AFTER `description`,
  ADD COLUMN IF NOT EXISTS `source_id` VARCHAR(36) DEFAULT NULL AFTER `source_type`,
  ADD COLUMN IF NOT EXISTS `location_address` TEXT DEFAULT NULL AFTER `description`,
  ADD COLUMN IF NOT EXISTS `contract_cost` DECIMAL(15,2) DEFAULT '0.00' AFTER `sanctioned_amount`,
  ADD COLUMN IF NOT EXISTS `paid_amount` DECIMAL(15,2) DEFAULT '0.00' AFTER `contract_cost`,
  ADD COLUMN IF NOT EXISTS `financial_year` VARCHAR(20) DEFAULT '2026-2027' AFTER `paid_amount`,
  ADD COLUMN IF NOT EXISTS `budget_head_id` VARCHAR(36) DEFAULT NULL AFTER `financial_year`,
  ADD COLUMN IF NOT EXISTS `target_completion_date` DATE DEFAULT NULL AFTER `target_date`,
  ADD COLUMN IF NOT EXISTS `actual_completion_date` DATE DEFAULT NULL AFTER `completion_date`,
  ADD COLUMN IF NOT EXISTS `is_public` BOOLEAN DEFAULT TRUE AFTER `status`,
  ADD COLUMN IF NOT EXISTS `created_by` VARCHAR(36) DEFAULT NULL AFTER `is_public`,
  ADD COLUMN IF NOT EXISTS `deleted_at` DATETIME DEFAULT NULL AFTER `updated_at`;

-- 2. WORK CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `work_categories` (
  `category_id` VARCHAR(36) PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. WORK ESTIMATE ITEMS TABLE
CREATE TABLE IF NOT EXISTS `work_estimate_items` (
  `item_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `item_name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `quantity` DECIMAL(12,3) NOT NULL,
  `unit` VARCHAR(30) NOT NULL,
  `rate` DECIMAL(12,2) NOT NULL,
  `amount` DECIMAL(15,2) GENERATED ALWAYS AS (quantity * rate) STORED,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_est_item_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. WORK APPROVAL HISTORY TABLE
CREATE TABLE IF NOT EXISTS `work_approval_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `approval_type` ENUM('TECHNICAL', 'ADMINISTRATIVE', 'FINANCIAL', 'FINAL', 'OTHER') NOT NULL,
  `from_status` VARCHAR(50) DEFAULT NULL,
  `to_status` VARCHAR(50) NOT NULL,
  `approved_by_id` VARCHAR(36) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_apph_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. WORK TENDERS & BIDS TABLES
CREATE TABLE IF NOT EXISTS `work_tenders` (
  `tender_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `tender_number` VARCHAR(50) UNIQUE NOT NULL,
  `tender_type` ENUM('OPEN', 'LIMITED', 'SINGLE', 'E_TENDER') DEFAULT 'OPEN',
  `publish_date` DATE NOT NULL,
  `submission_deadline` DATETIME NOT NULL,
  `estimated_value` DECIMAL(15,2) NOT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'EVALUATION', 'AWARDED', 'CANCELLED') DEFAULT 'PUBLISHED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tnd_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tender_bids` (
  `bid_id` VARCHAR(36) PRIMARY KEY,
  `tender_id` VARCHAR(36) NOT NULL,
  `contractor_id` VARCHAR(36) NOT NULL,
  `quoted_amount` DECIMAL(15,2) NOT NULL,
  `technical_score` DECIMAL(5,2) DEFAULT '100.00',
  `financial_score` DECIMAL(5,2) DEFAULT '100.00',
  `rank` INT DEFAULT 1,
  `status` ENUM('SUBMITTED', 'QUALIFIED', 'DISQUALIFIED', 'SELECTED', 'REJECTED') DEFAULT 'SUBMITTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bid_tnd` FOREIGN KEY (`tender_id`) REFERENCES `work_tenders` (`tender_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. WORK ORDERS TABLE
CREATE TABLE IF NOT EXISTS `work_orders` (
  `work_order_id` VARCHAR(36) PRIMARY KEY,
  `work_order_number` VARCHAR(50) UNIQUE NOT NULL,
  `work_id` VARCHAR(36) NOT NULL,
  `contractor_id` VARCHAR(36) NOT NULL,
  `issue_date` DATE NOT NULL,
  `start_date` DATE NOT NULL,
  `target_completion_date` DATE NOT NULL,
  `contract_amount` DECIMAL(15,2) NOT NULL,
  `terms_conditions` TEXT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wo_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. WORK MILESTONES TABLE
CREATE TABLE IF NOT EXISTS `work_milestones` (
  `milestone_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `milestone_name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sequence` INT NOT NULL DEFAULT 1,
  `planned_date` DATE DEFAULT NULL,
  `actual_date` DATE DEFAULT NULL,
  `percentage` INT NOT NULL DEFAULT 10,
  `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED') DEFAULT 'NOT_STARTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ms_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. WORK PROGRESS HISTORY TABLE
CREATE TABLE IF NOT EXISTS `work_progress_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `physical_progress` INT NOT NULL DEFAULT 0,
  `financial_progress` INT NOT NULL DEFAULT 0,
  `remarks` TEXT DEFAULT NULL,
  `updated_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wph_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. WORK INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `work_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `inspector_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `inspection_type` ENUM('PRE_WORK', 'PROGRESS', 'QUALITY', 'FINAL') DEFAULT 'PROGRESS',
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `quality_status` ENUM('PASS', 'FAIL', 'CONDITIONAL') DEFAULT 'PASS',
  `findings` TEXT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_winsp_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. WORK BILLS TABLE
CREATE TABLE IF NOT EXISTS `work_bills` (
  `bill_id` VARCHAR(36) PRIMARY KEY,
  `bill_number` VARCHAR(50) UNIQUE NOT NULL,
  `work_id` VARCHAR(36) NOT NULL,
  `bill_type` ENUM('RUNNING', 'FINAL') DEFAULT 'RUNNING',
  `bill_date` DATE NOT NULL,
  `gross_amount` DECIMAL(15,2) NOT NULL,
  `deductions` DECIMAL(15,2) DEFAULT '0.00',
  `net_amount` DECIMAL(15,2) GENERATED ALWAYS AS (gross_amount - deductions) STORED,
  `status` ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'PAID', 'REJECTED') DEFAULT 'SUBMITTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wbill_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. WORK DELAYS TABLE
CREATE TABLE IF NOT EXISTS `work_delays` (
  `delay_id` VARCHAR(36) PRIMARY KEY,
  `work_id` VARCHAR(36) NOT NULL,
  `delay_reason` ENUM('WEATHER', 'CONTRACTOR', 'MATERIAL', 'APPROVAL', 'SITE_ISSUE', 'FUNDING', 'PUBLIC_ISSUE', 'OTHER') DEFAULT 'CONTRACTOR',
  `delay_days` INT NOT NULL DEFAULT 0,
  `remarks` TEXT DEFAULT NULL,
  `updated_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wdel_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`work_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. SEED WORK CATEGORIES
INSERT INTO `work_categories` (`category_id`, `category_name`, `description`) VALUES
('wcat-001', 'Road Construction & Asphalt Resurfacing', 'Major road construction, tarring, and pothole repairs'),
('wcat-002', 'Footpath & Paver Block Work', 'Pedestrian sidewalk, curb, and paver block laying'),
('wcat-003', 'Storm Water Drainage System', 'Underground drainage, gutter construction, and cleaning'),
('wcat-004', 'Water Supply Pipeline Extension', 'Drinking water pipeline laying and booster pumps'),
('wcat-005', 'Streetlight & Electrical Infrastructure', 'LED pole installation, transformer, and cable laying')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

SET FOREIGN_KEY_CHECKS = 1;
