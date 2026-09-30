-- =============================================================================
-- DIGITAL CORPORATOR & SMART WARD MANAGEMENT PLATFORM
-- DATABASE SCHEMA (MySQL 8.0 / MariaDB Compatible for XAMPP)
-- Database Name: digital_corporator
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `digital_corporator` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `digital_corporator`;

-- Disable foreign key checks for clean creation
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. SAAS & TENANTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `tenants`;
CREATE TABLE `tenants` (
  `tenant_id` VARCHAR(36) PRIMARY KEY,
  `tenant_code` VARCHAR(50) UNIQUE NOT NULL,
  `tenant_name` VARCHAR(150) NOT NULL,
  `plan_id` VARCHAR(36) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING', 'CANCELLED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. CORPORATIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `corporations`;
CREATE TABLE `corporations` (
  `corporation_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `corporation_name` VARCHAR(150) NOT NULL,
  `corporation_code` VARCHAR(50) UNIQUE NOT NULL,
  `ulb_type` ENUM('MUNICIPAL_CORPORATION', 'MUNICIPAL_COUNCIL', 'NAGAR_PANCHAYAT') DEFAULT 'MUNICIPAL_CORPORATION',
  `state` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` TEXT,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(150) DEFAULT NULL,
  `financial_year` VARCHAR(20) DEFAULT '2026-2027',
  `timezone` VARCHAR(50) DEFAULT 'Asia/Kolkata',
  `language` VARCHAR(20) DEFAULT 'en',
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_corp_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`tenant_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. WARDS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `wards`;
CREATE TABLE `wards` (
  `ward_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `ward_number` INT NOT NULL,
  `ward_name` VARCHAR(100) NOT NULL,
  `area_sq_km` DECIMAL(10,2) DEFAULT '0.00',
  `population` INT DEFAULT '0',
  `households` INT DEFAULT '0',
  `boundary_geojson` LONGTEXT DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_corp_ward_num` (`corporation_id`, `ward_number`),
  CONSTRAINT `fk_ward_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ward_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`tenant_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. DEPARTMENTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `department_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `department_code` VARCHAR(50) NOT NULL,
  `department_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `head_user_id` VARCHAR(36) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_corp_dept_code` (`corporation_id`, `department_code`),
  CONSTRAINT `fk_dept_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. ROLES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) DEFAULT NULL,
  `role_code` VARCHAR(50) UNIQUE NOT NULL,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `is_system` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. PERMISSIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permission_id` VARCHAR(36) PRIMARY KEY,
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `scope` ENUM('ALL_CORPORATIONS', 'CORPORATION', 'WARD', 'DEPARTMENT', 'ASSIGNED_ONLY', 'OWN_RECORD') DEFAULT 'CORPORATION',
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_perm_mod_act` (`module`, `action`, `scope`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. ROLE_PERMISSIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` VARCHAR(36) NOT NULL,
  `permission_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. USERS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) DEFAULT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_code` VARCHAR(50) NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `designation` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_user_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. USER_ROLES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `user_id` VARCHAR(36) NOT NULL,
  `role_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. CITIZENS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `citizens`;
CREATE TABLE `citizens` (
  `citizen_id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) UNIQUE,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `mobile_number` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100),
  `address` TEXT,
  `identity_proof_type` VARCHAR(50),
  `identity_proof_no` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. COMPLAINT CATEGORIES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `complaint_categories`;
CREATE TABLE `complaint_categories` (
  `category_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) DEFAULT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `category_name` VARCHAR(100) NOT NULL,
  `sla_hours` INT DEFAULT 48,
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `description` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. COMPLAINTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
  `complaint_id` VARCHAR(36) PRIMARY KEY,
  `complaint_number` VARCHAR(50) UNIQUE NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `citizen_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `location_address` TEXT NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `status` ENUM('REGISTERED', 'ASSIGNED', 'IN_PROGRESS', 'INSPECTION', 'RESOLVED', 'CITIZEN_VERIFICATION', 'CLOSED', 'REOPENED', 'ESCALATED') DEFAULT 'REGISTERED',
  `sla_hours` INT DEFAULT 48,
  `sla_due_at` DATETIME DEFAULT NULL,
  `assigned_officer_id` VARCHAR(36) DEFAULT NULL,
  `resolved_at` DATETIME DEFAULT NULL,
  `closed_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cmp_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cmp_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cmp_dept` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. COMPLAINT HISTORY & ESCALATIONS
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `complaint_history`;
CREATE TABLE `complaint_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `from_status` VARCHAR(50),
  `to_status` VARCHAR(50) NOT NULL,
  `performed_by_id` VARCHAR(36) NOT NULL,
  `remarks` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cmph_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `complaint_escalations`;
CREATE TABLE `complaint_escalations` (
  `escalation_id` VARCHAR(36) PRIMARY KEY,
  `complaint_id` VARCHAR(36) NOT NULL,
  `escalated_from_user_id` VARCHAR(36),
  `escalated_to_user_id` VARCHAR(36) NOT NULL,
  `escalation_level` INT DEFAULT 1,
  `reason` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cmpe_cmp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. CONTRACTORS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `contractors`;
CREATE TABLE `contractors` (
  `contractor_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `license_number` VARCHAR(100) UNIQUE NOT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT '5.00',
  `status` ENUM('ACTIVE', 'BLACK_LISTED', 'SUSPENDED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. DEVELOPMENT WORKS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `works`;
CREATE TABLE `works` (
  `work_id` VARCHAR(36) PRIMARY KEY,
  `work_code` VARCHAR(50) UNIQUE NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) NOT NULL,
  `contractor_id` VARCHAR(36) DEFAULT NULL,
  `work_title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `estimated_cost` DECIMAL(15,2) NOT NULL,
  `approved_cost` DECIMAL(15,2) DEFAULT '0.00',
  `sanctioned_amount` DECIMAL(15,2) DEFAULT '0.00',
  `start_date` DATE DEFAULT NULL,
  `target_date` DATE DEFAULT NULL,
  `completion_date` DATE DEFAULT NULL,
  `physical_progress` INT DEFAULT 0,
  `financial_progress` INT DEFAULT 0,
  `status` ENUM('PROPOSED', 'APPROVED', 'TENDERED', 'WORK_ORDER_ISSUED', 'NOT_STARTED', 'ONGOING', 'DELAYED', 'COMPLETED', 'CANCELLED') DEFAULT 'PROPOSED',
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_work_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_work_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. FUNDS & BUDGET TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `budgets`;
CREATE TABLE `budgets` (
  `budget_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `tenant_id` VARCHAR(36) NOT NULL,
  `financial_year` VARCHAR(20) NOT NULL,
  `budget_head` VARCHAR(100) NOT NULL,
  `total_allocated` DECIMAL(15,2) NOT NULL,
  `sanctioned_amount` DECIMAL(15,2) NOT NULL,
  `utilized_amount` DECIMAL(15,2) DEFAULT '0.00',
  `available_amount` DECIMAL(15,2) GENERATED ALWAYS AS (total_allocated - utilized_amount) STORED,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 17. MEETINGS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `meetings`;
CREATE TABLE `meetings` (
  `meeting_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `meeting_title` VARCHAR(200) NOT NULL,
  `meeting_type` ENUM('GENERAL_BODY', 'STANDING_COMMITTEE', 'WORKS_COMMITTEE', 'SPECIAL_MEETING', 'WARD_MEETING') NOT NULL,
  `meeting_date` DATETIME NOT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED', 'CANCELLED') DEFAULT 'SCHEDULED',
  `agenda_summary` TEXT,
  `minutes_text` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 18. PROPOSALS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `proposals`;
CREATE TABLE `proposals` (
  `proposal_id` VARCHAR(36) PRIMARY KEY,
  `proposal_code` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) NOT NULL,
  `submitted_by_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `estimated_budget` DECIMAL(15,2) NOT NULL,
  `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CONVERTED_TO_WORK') DEFAULT 'SUBMITTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 19. NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `notification_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'INFO',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 20. AUDIT LOGS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `log_id` VARCHAR(36) PRIMARY KEY,
  `tenant_id` VARCHAR(36) DEFAULT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
