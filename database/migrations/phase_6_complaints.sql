-- =============================================================================
-- PHASE 6: COMPLETE COMPLAINT & GRIEVANCE MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ALTER COMPLAINTS TABLE ENUM AND COLUMNS
ALTER TABLE `complaints`
  MODIFY COLUMN `status` ENUM('REGISTERED', 'TRIAGED', 'ASSIGNED', 'ACCEPTED', 'INSPECTION_PENDING', 'INSPECTION_COMPLETED', 'IN_PROGRESS', 'WAITING_FOR_INFORMATION', 'RESOLVED', 'CITIZEN_VERIFICATION', 'CLOSED', 'REOPENED', 'ESCALATED', 'REJECTED', 'CANCELLED') DEFAULT 'REGISTERED',
  ADD COLUMN IF NOT EXISTS `subcategory_id` VARCHAR(36) DEFAULT NULL AFTER `category_id`,
  ADD COLUMN IF NOT EXISTS `source` ENUM('WEB', 'MOBILE', 'CORPORATOR', 'OFFICER', 'ADMIN', 'PUBLIC') DEFAULT 'WEB' AFTER `longitude`,
  ADD COLUMN IF NOT EXISTS `priority_reason` VARCHAR(255) DEFAULT NULL AFTER `priority`,
  ADD COLUMN IF NOT EXISTS `priority_updated_by` VARCHAR(36) DEFAULT NULL AFTER `priority_reason`,
  ADD COLUMN IF NOT EXISTS `priority_updated_at` DATETIME DEFAULT NULL AFTER `priority_updated_by`,
  ADD COLUMN IF NOT EXISTS `sla_started_at` DATETIME DEFAULT NULL AFTER `sla_hours`,
  ADD COLUMN IF NOT EXISTS `reopened_at` DATETIME DEFAULT NULL AFTER `closed_at`,
  ADD COLUMN IF NOT EXISTS `deleted_at` DATETIME DEFAULT NULL AFTER `updated_at`;

-- 2. COMPLAINT SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `complaint_subcategories` (
  `subcategory_id` VARCHAR(36) PRIMARY KEY,
  `category_id` VARCHAR(36) NOT NULL,
  `subcategory_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `default_department_id` VARCHAR(36) DEFAULT NULL,
  `default_sla_hours` INT DEFAULT 24,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_subcat_cat` FOREIGN KEY (`category_id`) REFERENCES `complaint_categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COMPLAINT ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS `complaint_attachments` (
  `attachment_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT DEFAULT 0,
  `uploaded_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_att_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. COMPLAINT INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `complaint_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `officer_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `inspection_time` TIME DEFAULT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `remarks` TEXT NOT NULL,
  `findings` TEXT DEFAULT NULL,
  `recommendation` TEXT DEFAULT NULL,
  `inspection_result` ENUM('VALID', 'INVALID', 'NEEDS_WORK', 'NEEDS_APPROVAL', 'REFERRED') DEFAULT 'VALID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_insp_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. COMPLAINT PROGRESS TABLE
CREATE TABLE IF NOT EXISTS `complaint_progress` (
  `progress_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `officer_id` VARCHAR(36) NOT NULL,
  `progress_percentage` INT NOT NULL DEFAULT 0,
  `remarks` TEXT NOT NULL,
  `estimated_completion_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_prog_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COMPLAINT RESOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS `complaint_resolutions` (
  `resolution_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `officer_id` VARCHAR(36) NOT NULL,
  `resolution_type` ENUM('RESOLVED', 'PARTIALLY_RESOLVED', 'INFORMATION_PROVIDED', 'NO_ACTION_REQUIRED') DEFAULT 'RESOLVED',
  `resolution_description` TEXT NOT NULL,
  `resolution_cost` DECIMAL(12,2) DEFAULT '0.00',
  `resolved_at` DATETIME NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_res_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. COMPLAINT FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS `complaint_feedback` (
  `feedback_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL UNIQUE,
  `citizen_id` VARCHAR(36) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT DEFAULT NULL,
  `is_satisfied` BOOLEAN DEFAULT TRUE,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fb_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. COMPLAINT COMMENTS TABLE
CREATE TABLE IF NOT EXISTS `complaint_comments` (
  `comment_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `comment_text` TEXT NOT NULL,
  `visibility` ENUM('PUBLIC', 'INTERNAL') DEFAULT 'PUBLIC',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cmt_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. COMPLAINT RELATIONS TABLE (DUPLICATES / LINKED)
CREATE TABLE IF NOT EXISTS `complaint_relations` (
  `relation_id` VARCHAR(36) PRIMARY KEY,
  `parent_complaint_id` VARCHAR(36) NOT NULL,
  `child_complaint_id` VARCHAR(36) NOT NULL,
  `relation_type` ENUM('DUPLICATE', 'RELATED', 'PARENT', 'CHILD') DEFAULT 'DUPLICATE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SEED MASTER SUBCATEGORIES
INSERT INTO `complaint_subcategories` (`subcategory_id`, `category_id`, `subcategory_name`, `description`, `default_department_id`, `default_sla_hours`) VALUES
('sub-001', 'cat-001', 'Streetlight Light Blinking/Defect', 'Non-functioning or flickering street lights', 'd-demo-002', 24),
('sub-002', 'cat-001', 'Pole Damage & Wiring Failure', 'Damaged street pole or live wire exposure', 'd-demo-002', 12),
('sub-003', 'cat-002', 'Garbage Overflow & Missed Collection', 'Garbage bin overflowing or not collected', 'd-demo-006', 12),
('sub-004', 'cat-003', 'Pothole & Asphalt Road Damage', 'Dangerous road potholes and cracks', 'd-demo-001', 72),
('sub-005', 'cat-004', 'Water Pipeline Burst & Leakage', 'Pipeline leakage or major water loss', 'd-demo-003', 12)
ON DUPLICATE KEY UPDATE `subcategory_name` = VALUES(`subcategory_name`);

SET FOREIGN_KEY_CHECKS = 1;
