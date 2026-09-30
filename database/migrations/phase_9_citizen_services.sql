-- =============================================================================
-- PHASE 9: CITIZEN SERVICES & ONLINE APPLICATION MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `service_categories` (
  `category_id` VARCHAR(36) PRIMARY KEY,
  `category_code` VARCHAR(50) NOT NULL UNIQUE,
  `category_name` VARCHAR(150) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SERVICE MASTER TABLE
CREATE TABLE IF NOT EXISTS `service_types` (
  `service_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `service_code` VARCHAR(50) NOT NULL UNIQUE,
  `service_name` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `processing_days` INT NOT NULL DEFAULT 7,
  `fee_required` BOOLEAN DEFAULT FALSE,
  `fee_amount` DECIMAL(15,2) DEFAULT '0.00',
  `inspection_required` BOOLEAN DEFAULT FALSE,
  `is_public` BOOLEAN DEFAULT TRUE,
  `status` ENUM('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SERVICE FIELDS TABLE (Dynamic Form Builder)
CREATE TABLE IF NOT EXISTS `service_fields` (
  `field_id` VARCHAR(36) PRIMARY KEY,
  `service_id` VARCHAR(36) NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `label` VARCHAR(200) NOT NULL,
  `type` ENUM('TEXT', 'NUMBER', 'EMAIL', 'MOBILE', 'DATE', 'DROPDOWN', 'RADIO', 'CHECKBOX', 'TEXTAREA', 'FILE', 'ADDRESS', 'LOCATION') NOT NULL DEFAULT 'TEXT',
  `required` BOOLEAN DEFAULT TRUE,
  `options_json` TEXT DEFAULT NULL,
  `sequence` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_field_service` FOREIGN KEY (`service_id`) REFERENCES `service_types` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SERVICE DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS `service_documents` (
  `service_doc_id` VARCHAR(36) PRIMARY KEY,
  `service_id` VARCHAR(36) NOT NULL,
  `document_name` VARCHAR(150) NOT NULL,
  `is_mandatory` BOOLEAN DEFAULT TRUE,
  `allowed_types` VARCHAR(100) DEFAULT 'pdf,jpg,jpeg,png',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_doc_service` FOREIGN KEY (`service_id`) REFERENCES `service_types` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. APPLICATIONS MASTER TABLE
CREATE TABLE IF NOT EXISTS `applications` (
  `application_id` VARCHAR(36) PRIMARY KEY,
  `application_number` VARCHAR(50) UNIQUE NOT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `citizen_id` VARCHAR(36) NOT NULL,
  `service_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `assigned_officer_id` VARCHAR(36) DEFAULT NULL,
  `status` ENUM('DRAFT', 'SUBMITTED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'UNDER_SCRUTINY', 'DOCUMENT_VERIFICATION', 'INSPECTION_PENDING', 'INSPECTION_COMPLETED', 'CLARIFICATION_REQUIRED', 'RESUBMITTED', 'APPROVAL_PENDING', 'APPROVED', 'REJECTED', 'CERTIFICATE_GENERATED', 'DELIVERED', 'CLOSED', 'CANCELLED') DEFAULT 'SUBMITTED',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `sla_deadline` DATE DEFAULT NULL,
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  `rejected_at` TIMESTAMP NULL DEFAULT NULL,
  `closed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. APPLICATION FORM DATA TABLE (Form Snapshot)
CREATE TABLE IF NOT EXISTS `application_form_data` (
  `data_id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `field_name` VARCHAR(100) NOT NULL,
  `field_value` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fdata_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. APPLICATION DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS `application_documents` (
  `app_doc_id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `document_name` VARCHAR(150) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `verification_status` ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
  `remarks` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_adoc_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. APPLICATION HISTORY TABLE
CREATE TABLE IF NOT EXISTS `application_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `old_status` VARCHAR(50) DEFAULT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `performed_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hist_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. APPLICATION CLARIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `application_clarifications` (
  `clarification_id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `clarification_question` TEXT NOT NULL,
  `requested_by_id` VARCHAR(36) NOT NULL,
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `response` TEXT DEFAULT NULL,
  `responded_at` TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT `fk_clar_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. APPLICATION INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS `application_inspections` (
  `inspection_id` VARCHAR(36) PRIMARY KEY,
  `application_id` VARCHAR(36) NOT NULL,
  `inspector_id` VARCHAR(36) NOT NULL,
  `inspection_date` DATE NOT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `findings` TEXT NOT NULL,
  `result` ENUM('PASS', 'FAIL', 'CONDITIONAL') DEFAULT 'PASS',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_insp_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. APPLICATION CERTIFICATES TABLE (QR Public Verification)
CREATE TABLE IF NOT EXISTS `application_certificates` (
  `certificate_id` VARCHAR(36) PRIMARY KEY,
  `certificate_number` VARCHAR(50) UNIQUE NOT NULL,
  `application_id` VARCHAR(36) NOT NULL UNIQUE,
  `corporation_id` VARCHAR(36) NOT NULL,
  `service_name` VARCHAR(150) NOT NULL,
  `issue_date` DATE NOT NULL,
  `file_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('VALID', 'REVOKED') DEFAULT 'VALID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. SEED 15 MUNICIPAL SERVICE CATEGORIES & TYPES
INSERT INTO `service_categories` (`category_id`, `category_code`, `category_name`, `description`) VALUES
('cat-001', 'CAT-CERT', 'Civil Registration & Certificates', 'Birth, death, marriage and domicile certificates'),
('cat-002', 'CAT-UTIL', 'Water & Sewerage Utilities', 'New water connection, disconnection and pipeline NOC'),
('cat-003', 'CAT-COMM', 'Trade & Commercial Licenses', 'Trade license, shop establishment, advertisement hoardings'),
('cat-004', 'CAT-BLDG', 'Town Planning & Building Permissions', 'Building construction permission, plot layout sanction')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

INSERT INTO `service_types` (`service_id`, `corporation_id`, `service_code`, `service_name`, `category_id`, `processing_days`, `fee_required`, `fee_amount`, `inspection_required`, `status`) VALUES
('srv-001', 'c-demo-001', 'SRV-BIRTH', 'Birth Certificate Issuance', 'cat-001', 3, TRUE, 50.00, FALSE, 'ACTIVE'),
('srv-002', 'c-demo-001', 'SRV-DEATH', 'Death Certificate Issuance', 'cat-001', 3, TRUE, 50.00, FALSE, 'ACTIVE'),
('srv-003', 'c-demo-001', 'SRV-MARRIAGE', 'Marriage Registration Certificate', 'cat-001', 7, TRUE, 250.00, FALSE, 'ACTIVE'),
('srv-004', 'c-demo-001', 'SRV-WATER-NEW', 'New Residential Water Connection', 'cat-002', 10, TRUE, 500.00, TRUE, 'ACTIVE'),
('srv-005', 'c-demo-001', 'SRV-WATER-DISC', 'Water Connection Disconnection NOC', 'cat-002', 5, FALSE, 0.00, TRUE, 'ACTIVE'),
('srv-006', 'c-demo-001', 'SRV-TRADE-NEW', 'New Municipal Trade License', 'cat-003', 7, TRUE, 1500.00, TRUE, 'ACTIVE'),
('srv-007', 'c-demo-001', 'SRV-SHOP-LIC', 'Shop & Commercial Establishment License', 'cat-003', 5, TRUE, 750.00, FALSE, 'ACTIVE'),
('srv-008', 'c-demo-001', 'SRV-ADV-PERM', 'Advertisement Hoarding Permission', 'cat-003', 7, TRUE, 3000.00, TRUE, 'ACTIVE'),
('srv-009', 'c-demo-001', 'SRV-BLDG-PERM', 'Building Construction Permission', 'cat-004', 15, TRUE, 5000.00, TRUE, 'ACTIVE'),
('srv-010', 'c-demo-001', 'SRV-TREE-PERM', 'Tree Trimming / Felling Permission', 'cat-004', 5, FALSE, 0.00, TRUE, 'ACTIVE'),
('srv-011', 'c-demo-001', 'SRV-GARDEN-BOOK', 'Municipal Garden Event Booking', 'cat-004', 3, TRUE, 2000.00, FALSE, 'ACTIVE'),
('srv-012', 'c-demo-001', 'SRV-ROAD-CUT', 'Road Cutting Permission NOC', 'cat-002', 7, TRUE, 1000.00, TRUE, 'ACTIVE'),
('srv-013', 'c-demo-001', 'SRV-EVENT-PERM', 'Public Event & Loudspeaker Permission', 'cat-003', 3, TRUE, 500.00, FALSE, 'ACTIVE'),
('srv-014', 'c-demo-001', 'SRV-HALL-BOOK', 'Community Hall Reservation', 'cat-001', 2, TRUE, 1200.00, FALSE, 'ACTIVE'),
('srv-015', 'c-demo-001', 'SRV-PROP-MUT', 'Property Mutation Certificate', 'cat-004', 14, TRUE, 1000.00, FALSE, 'ACTIVE')
ON DUPLICATE KEY UPDATE `service_name` = VALUES(`service_name`);

SET FOREIGN_KEY_CHECKS = 1;
