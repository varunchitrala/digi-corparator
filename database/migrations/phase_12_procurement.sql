-- =============================================================================
-- PHASE 12: TENDER, PROCUREMENT, VENDOR & CONTRACT MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. PROCUREMENT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS `procurement_requests` (
  `request_id` VARCHAR(36) PRIMARY KEY,
  `request_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `estimated_cost` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `budget_head_id` VARCHAR(36) DEFAULT NULL,
  `requested_by_id` VARCHAR(36) NOT NULL,
  `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'TENDER_REQUIRED', 'CANCELLED') DEFAULT 'SUBMITTED',
  `approved_by_id` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TENDERS MASTER TABLE
CREATE TABLE IF NOT EXISTS `tenders` (
  `tender_id` VARCHAR(36) PRIMARY KEY,
  `tender_number` VARCHAR(50) UNIQUE NOT NULL,
  `procurement_request_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `tender_type` ENUM('WORKS', 'GOODS', 'SERVICES', 'CONSULTANCY', 'MAINTENANCE') DEFAULT 'WORKS',
  `estimated_value` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `emd_amount` DECIMAL(15,2) DEFAULT '0.00',
  `tender_fee` DECIMAL(15,2) DEFAULT '0.00',
  `submission_start` DATETIME NOT NULL,
  `submission_end` DATETIME NOT NULL,
  `technical_opening_date` DATETIME DEFAULT NULL,
  `financial_opening_date` DATETIME DEFAULT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'OPEN', 'CLOSING_SOON', 'CLOSED', 'UNDER_TECHNICAL_EVALUATION', 'UNDER_FINANCIAL_EVALUATION', 'AWAITING_APPROVAL', 'AWARDED', 'CANCELLED', 'REJECTED', 'ARCHIVED') DEFAULT 'DRAFT',
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TENDER BOQ ITEMS TABLE
CREATE TABLE IF NOT EXISTS `tender_boq_items` (
  `boq_item_id` VARCHAR(36) PRIMARY KEY,
  `tender_id` VARCHAR(36) NOT NULL,
  `item_code` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL DEFAULT '1.00',
  `estimated_rate` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_boq_tndr` FOREIGN KEY (`tender_id`) REFERENCES `tenders` (`tender_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. VENDORS MASTER TABLE
CREATE TABLE IF NOT EXISTS `vendors` (
  `vendor_id` VARCHAR(36) PRIMARY KEY,
  `vendor_code` VARCHAR(50) UNIQUE NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `vendor_name` VARCHAR(150) NOT NULL,
  `legal_name` VARCHAR(150) NOT NULL,
  `pan` VARCHAR(20) NOT NULL,
  `gstin` VARCHAR(25) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'BLACKLISTED', 'INACTIVE') DEFAULT 'ACTIVE',
  `blacklisted` BOOLEAN DEFAULT FALSE,
  `blacklist_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BIDS TABLE
CREATE TABLE IF NOT EXISTS `bids` (
  `bid_id` VARCHAR(36) PRIMARY KEY,
  `bid_number` VARCHAR(50) UNIQUE NOT NULL,
  `tender_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `quoted_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `technical_status` ENUM('PENDING', 'QUALIFIED', 'DISQUALIFIED') DEFAULT 'PENDING',
  `financial_status` ENUM('SEALED', 'OPENED', 'L1', 'L2', 'L3', 'REJECTED') DEFAULT 'SEALED',
  `status` ENUM('DRAFT', 'SUBMITTED', 'WITHDRAWN', 'QUALIFIED', 'AWARDED', 'REJECTED') DEFAULT 'SUBMITTED',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bid_tndr` FOREIGN KEY (`tender_id`) REFERENCES `tenders` (`tender_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bid_ven` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TECHNICAL EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS `technical_evaluations` (
  `evaluation_id` VARCHAR(36) PRIMARY KEY,
  `bid_id` VARCHAR(36) NOT NULL UNIQUE,
  `evaluator_id` VARCHAR(36) NOT NULL,
  `score` INT NOT NULL DEFAULT 85,
  `result` ENUM('QUALIFIED', 'DISQUALIFIED') NOT NULL DEFAULT 'QUALIFIED',
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_teval_bid` FOREIGN KEY (`bid_id`) REFERENCES `bids` (`bid_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. LETTERS OF AWARD (LOA) TABLE
CREATE TABLE IF NOT EXISTS `letters_of_award` (
  `loa_id` VARCHAR(36) PRIMARY KEY,
  `loa_number` VARCHAR(50) UNIQUE NOT NULL,
  `tender_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `award_amount` DECIMAL(15,2) NOT NULL,
  `award_date` DATE NOT NULL,
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_loa_tndr` FOREIGN KEY (`tender_id`) REFERENCES `tenders` (`tender_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_loa_ven` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CONTRACTS MASTER TABLE
CREATE TABLE IF NOT EXISTS `contracts` (
  `contract_id` VARCHAR(36) PRIMARY KEY,
  `contract_number` VARCHAR(50) UNIQUE NOT NULL,
  `tender_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `work_order_id` VARCHAR(36) DEFAULT NULL,
  `contract_value` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `retention_percentage` DECIMAL(5,2) DEFAULT '5.00',
  `status` ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'EXPIRING', 'EXPIRED', 'TERMINATED', 'COMPLETED', 'CLOSED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cnt_tndr` FOREIGN KEY (`tender_id`) REFERENCES `tenders` (`tender_id`),
  CONSTRAINT `fk_cnt_ven` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SEED DEMO PROCUREMENT REQUESTS, TENDERS & VENDORS
INSERT INTO `procurement_requests` (`request_id`, `request_number`, `corporation_id`, `department_id`, `ward_id`, `title`, `description`, `estimated_cost`, `budget_head_id`, `requested_by_id`, `status`) VALUES
('pr-001', 'PR-2026-000001', 'c-demo-001', 'dept-001', 'w-demo-024', 'Asphalt Road Concreting Ward 24', 'Requirement for 2km asphalt road concreting', 1200000.00, 'bhead-001', 'u-dept-001', 'APPROVED')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `tenders` (`tender_id`, `tender_number`, `procurement_request_id`, `corporation_id`, `department_id`, `ward_id`, `title`, `description`, `tender_type`, `estimated_value`, `emd_amount`, `tender_fee`, `submission_start`, `submission_end`, `status`, `created_by_id`) VALUES
('tndr-001', 'TNDR-2026-000001', 'pr-001', 'c-demo-001', 'dept-001', 'w-demo-024', 'Road Concreting Work Ward 24', 'Tender for 2km Asphalt Concreting Work Ward 24', 'WORKS', 1200000.00, 24000.00, 2000.00, '2026-08-01 09:00:00', '2026-09-15 17:00:00', 'PUBLISHED', 'u-corp-001')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `vendors` (`vendor_id`, `vendor_code`, `corporation_id`, `vendor_name`, `legal_name`, `pan`, `gstin`, `address`, `contact_person`, `mobile`, `email`, `status`) VALUES
('ven-001', 'VEN-2026-000001', 'c-demo-001', 'Apex Infrastructure Ltd', 'Apex Infrastructure Pvt Ltd', 'ABCDE1234F', '27ABCDE1234F1Z5', 'Industrial Estate Ward 24', 'Rajesh Sharma', '9822088776', 'contact@apexinfra.com', 'ACTIVE')
ON DUPLICATE KEY UPDATE `vendor_name` = VALUES(`vendor_name`);

INSERT INTO `bids` (`bid_id`, `bid_number`, `tender_id`, `vendor_id`, `quoted_amount`, `technical_status`, `financial_status`, `status`) VALUES
('bid-001', 'BID-2026-000001', 'tndr-001', 'ven-001', 1150000.00, 'QUALIFIED', 'L1', 'SUBMITTED')
ON DUPLICATE KEY UPDATE `quoted_amount` = VALUES(`quoted_amount`);

SET FOREIGN_KEY_CHECKS = 1;
