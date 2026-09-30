-- =============================================================================
-- PHASE 8: FUND, BUDGET & FINANCIAL MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. FINANCIAL YEARS TABLE
CREATE TABLE IF NOT EXISTS `financial_years` (
  `fy_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `financial_year` VARCHAR(20) NOT NULL UNIQUE,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('UPCOMING', 'ACTIVE', 'CLOSED', 'ARCHIVED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BUDGET HEADS TABLE
CREATE TABLE IF NOT EXISTS `budget_heads` (
  `budget_head_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `budget_head_code` VARCHAR(50) NOT NULL,
  `budget_head_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'INFRASTRUCTURE',
  `parent_id` VARCHAR(36) DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'FROZEN', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_corp_bhead_code` (`corporation_id`, `budget_head_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BUDGET HEAD ALLOCATIONS TABLE
CREATE TABLE IF NOT EXISTS `budget_head_allocations` (
  `allocation_id` VARCHAR(36) PRIMARY KEY,
  `budget_id` VARCHAR(36) NOT NULL,
  `budget_head_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `work_id` VARCHAR(36) DEFAULT NULL,
  `allocated_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `reserved_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `committed_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `utilized_amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BUDGET APPROVAL HISTORY TABLE
CREATE TABLE IF NOT EXISTS `budget_approval_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `budget_id` VARCHAR(36) NOT NULL,
  `approval_type` ENUM('SUBMISSION', 'REVIEW', 'APPROVAL', 'REJECTION', 'FREEZE', 'CLOSURE') NOT NULL,
  `old_status` VARCHAR(50) DEFAULT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `approved_by_id` VARCHAR(36) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. FUND TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS `fund_transfers` (
  `transfer_id` VARCHAR(36) PRIMARY KEY,
  `from_allocation_id` VARCHAR(36) NOT NULL,
  `to_allocation_id` VARCHAR(36) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `reason` TEXT NOT NULL,
  `requested_by_id` VARCHAR(36) NOT NULL,
  `approved_by_id` VARCHAR(36) DEFAULT NULL,
  `status` ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'APPROVED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EXPENDITURES TABLE
CREATE TABLE IF NOT EXISTS `expenditures` (
  `expenditure_id` VARCHAR(36) PRIMARY KEY,
  `expenditure_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `work_id` VARCHAR(36) DEFAULT NULL,
  `bill_id` VARCHAR(36) DEFAULT NULL,
  `budget_head_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'POSTED', 'REJECTED') DEFAULT 'POSTED',
  `created_by_id` VARCHAR(36) NOT NULL,
  `approved_by_id` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PAYMENTS & DEDUCTIONS TABLES
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` VARCHAR(36) PRIMARY KEY,
  `payment_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `bill_id` VARCHAR(36) NOT NULL UNIQUE,
  `work_id` VARCHAR(36) DEFAULT NULL,
  `payee_type` VARCHAR(50) DEFAULT 'CONTRACTOR',
  `payee_id` VARCHAR(36) DEFAULT NULL,
  `gross_amount` DECIMAL(15,2) NOT NULL,
  `deductions` DECIMAL(15,2) DEFAULT '0.00',
  `net_amount` DECIMAL(15,2) GENERATED ALWAYS AS (gross_amount - deductions) STORED,
  `payment_date` DATE NOT NULL,
  `payment_mode` ENUM('MANUAL', 'BANK_TRANSFER', 'NEFT', 'RTGS', 'CHEQUE') DEFAULT 'BANK_TRANSFER',
  `reference_number` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'PROCESSED', 'PAID', 'FAILED', 'CANCELLED') DEFAULT 'PAID',
  `created_by_id` VARCHAR(36) NOT NULL,
  `approved_by_id` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment_deductions` (
  `deduction_id` VARCHAR(36) PRIMARY KEY,
  `payment_id` VARCHAR(36) NOT NULL,
  `deduction_type` ENUM('TDS', 'GST_TDS', 'SECURITY_DEPOSIT', 'RETENTION', 'PENALTY', 'OTHER') DEFAULT 'TDS',
  `amount` DECIMAL(15,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ded_pay` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. FINANCIAL TRANSACTIONS LEDGER TABLE
CREATE TABLE IF NOT EXISTS `financial_transactions` (
  `transaction_id` VARCHAR(36) PRIMARY KEY,
  `transaction_number` VARCHAR(50) UNIQUE NOT NULL,
  `transaction_type` ENUM('ALLOCATION', 'TRANSFER', 'RESERVATION', 'COMMITMENT', 'EXPENDITURE', 'PAYMENT', 'REFUND', 'ADJUSTMENT') NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `budget_head_id` VARCHAR(36) DEFAULT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `work_id` VARCHAR(36) DEFAULT NULL,
  `debit_amount` DECIMAL(15,2) DEFAULT '0.00',
  `credit_amount` DECIMAL(15,2) DEFAULT '0.00',
  `reference_id` VARCHAR(50) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `created_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SEED FINANCIAL YEAR 2026-27 & BUDGET HEADS
INSERT INTO `financial_years` (`fy_id`, `corporation_id`, `financial_year`, `start_date`, `end_date`, `status`) VALUES
('fy-2026', 'c-demo-001', '2026-27', '2026-04-01', '2027-03-31', 'ACTIVE')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `budget_heads` (`budget_head_id`, `corporation_id`, `budget_head_code`, `budget_head_name`, `category`, `description`) VALUES
('bhead-001', 'c-demo-001', 'BH-101', 'Road Infrastructure & Development', 'INFRASTRUCTURE', 'Budget head for asphalt road construction and paver blocks'),
('bhead-002', 'c-demo-001', 'BH-102', 'Storm Water Drainage & Sewerage', 'SANITATION', 'Budget head for underground storm water drainage'),
('bhead-003', 'c-demo-001', 'BH-103', 'Drinking Water Supply Infrastructure', 'UTILITIES', 'Budget head for water pipeline extension and pumps'),
('bhead-004', 'c-demo-001', 'BH-104', 'Streetlight & Electrical Infrastructure', 'UTILITIES', 'Budget head for LED streetlight poles and transformers')
ON DUPLICATE KEY UPDATE `budget_head_name` = VALUES(`budget_head_name`);

SET FOREIGN_KEY_CHECKS = 1;
