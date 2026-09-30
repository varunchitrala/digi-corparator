-- =============================================================================
-- PHASE 3: SUPER ADMIN SaaS MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SAAS PLANS TABLE
CREATE TABLE IF NOT EXISTS `plans` (
  `plan_id` VARCHAR(36) PRIMARY KEY,
  `plan_code` VARCHAR(50) UNIQUE NOT NULL,
  `plan_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `billing_cycle` ENUM('MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM') DEFAULT 'YEARLY',
  `max_users` INT DEFAULT 50,
  `max_wards` INT DEFAULT 30,
  `max_storage_gb` INT DEFAULT 100,
  `max_api_requests` INT DEFAULT 100000,
  `support_level` VARCHAR(50) DEFAULT 'STANDARD',
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SAAS MODULES TABLE
CREATE TABLE IF NOT EXISTS `modules` (
  `module_id` VARCHAR(36) PRIMARY KEY,
  `module_code` VARCHAR(50) UNIQUE NOT NULL,
  `module_name` VARCHAR(100) NOT NULL,
  `category` ENUM('CORE', 'CITIZEN', 'CORPORATOR', 'OFFICER', 'GIS', 'FINANCE', 'MEETING', 'DOCUMENT', 'AI', 'REPORTING', 'ADMIN') DEFAULT 'CORE',
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'Layers',
  `route` VARCHAR(100) NOT NULL,
  `depends_on` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PLAN_MODULES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS `plan_modules` (
  `plan_id` VARCHAR(36) NOT NULL,
  `module_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`plan_id`, `module_id`),
  CONSTRAINT `fk_pm_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pm_mod` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `subscription_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `plan_id` VARCHAR(36) NOT NULL,
  `billing_cycle` ENUM('MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM') DEFAULT 'YEARLY',
  `status` ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'EXPIRED', 'SUSPENDED', 'CANCELLED') DEFAULT 'ACTIVE',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sub_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CORPORATION_MODULES TABLE
CREATE TABLE IF NOT EXISTS `corporation_modules` (
  `corporation_id` VARCHAR(36) NOT NULL,
  `module_id` VARCHAR(36) NOT NULL,
  `is_enabled` BOOLEAN DEFAULT TRUE,
  `override_reason` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`corporation_id`, `module_id`),
  CONSTRAINT `fk_cm_corp` FOREIGN KEY (`corporation_id`) REFERENCES `corporations` (`corporation_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cm_mod` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SLA RULES MASTER TABLE
CREATE TABLE IF NOT EXISTS `sla_rules` (
  `rule_id` VARCHAR(36) PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL,
  `department_code` VARCHAR(50) NOT NULL,
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  `sla_hours` INT NOT NULL DEFAULT 24,
  `warning_hours` INT NOT NULL DEFAULT 4,
  `escalation_level` INT DEFAULT 1,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. NOTIFICATION TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS `notification_templates` (
  `template_id` VARCHAR(36) PRIMARY KEY,
  `template_name` VARCHAR(100) NOT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `channel` ENUM('IN_APP', 'EMAIL', 'SMS', 'PUSH', 'WHATSAPP') DEFAULT 'IN_APP',
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. API KEYS TABLE
CREATE TABLE IF NOT EXISTS `api_keys` (
  `key_id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `key_identifier` VARCHAR(50) UNIQUE NOT NULL,
  `secret_hash` VARCHAR(255) NOT NULL,
  `corporation_id` VARCHAR(36) DEFAULT NULL,
  `permissions` TEXT,
  `status` ENUM('ACTIVE', 'REVOKED', 'EXPIRED') DEFAULT 'ACTIVE',
  `expires_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. GIS LAYERS TABLE
CREATE TABLE IF NOT EXISTS `gis_layers` (
  `layer_id` VARCHAR(36) PRIMARY KEY,
  `layer_code` VARCHAR(50) UNIQUE NOT NULL,
  `layer_name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) DEFAULT 'MapPin',
  `color` VARCHAR(20) DEFAULT '#2563eb',
  `is_visible` BOOLEAN DEFAULT TRUE,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'GENERAL',
  `description` VARCHAR(255),
  `is_public` BOOLEAN DEFAULT FALSE,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED DATA FOR PHASE 3
-- =============================================================================

-- Seed SaaS Plans
INSERT INTO `plans` (`plan_id`, `plan_code`, `plan_name`, `description`, `price`, `billing_cycle`, `max_users`, `max_wards`, `status`) VALUES
('plan-basic', 'BASIC', 'Basic Municipal Plan', 'Standard ward management for small councils', 49999.00, 'YEARLY', 20, 15, 'ACTIVE'),
('plan-pro', 'PROFESSIONAL', 'Professional City Plan', 'Comprehensive governance for medium cities', 149999.00, 'YEARLY', 100, 50, 'ACTIVE'),
('plan-ent', 'ENTERPRISE', 'Enterprise Smart City', 'Full AI, GIS, & unlimited ward telemetry', 399999.00, 'YEARLY', 500, 200, 'ACTIVE')
ON DUPLICATE KEY UPDATE `plan_name` = VALUES(`plan_name`);

-- Seed SaaS Modules
INSERT INTO `modules` (`module_id`, `module_code`, `module_name`, `category`, `description`, `route`, `depends_on`, `status`) VALUES
('mod-001', 'COMPLAINTS', 'Complaints Management', 'CORE', 'Grievance registration, SLA escalation & tracking', '/complaints', NULL, 'ACTIVE'),
('mod-002', 'WORKS', 'Development Works', 'CORE', 'Civil works, milestone tracking & progress', '/works', NULL, 'ACTIVE'),
('mod-003', 'FUNDS', 'Fund Management', 'FINANCE', 'Budget heads allocation & financial telemetry', '/funds', NULL, 'ACTIVE'),
('mod-004', 'MEETINGS', 'Meetings & General Body', 'MEETING', 'Committee schedules, minutes & action items', '/meetings', NULL, 'ACTIVE'),
('mod-005', 'PROPOSALS', 'Proposals & Agenda', 'CORPORATOR', 'Corporator proposal pipeline & approvals', '/proposals', NULL, 'ACTIVE'),
('mod-006', 'GIS', 'GIS Spatial Mapping', 'GIS', 'OpenStreetMap ward boundary & asset tracking', '/gis', 'Wards', 'ACTIVE'),
('mod-007', 'AI', 'AI NagarSevak Assistant', 'AI', 'Natural language query analyzer', '/ai', 'Complaints', 'ACTIVE'),
('mod-008', 'REPORTS', 'Reports & MIS', 'REPORTING', 'Exportable municipal analytics', '/reports', NULL, 'ACTIVE'),
('mod-009', 'TRANSPARENCY', 'Public Dashboard', 'CITIZEN', 'Citizen public transparency portal', '/transparency', 'Complaints', 'ACTIVE')
ON DUPLICATE KEY UPDATE `module_name` = VALUES(`module_name`);

-- Seed Subscriptions
INSERT INTO `subscriptions` (`subscription_id`, `corporation_id`, `plan_id`, `billing_cycle`, `status`, `start_date`, `end_date`, `amount`) VALUES
('sub-demo-001', 'c-demo-001', 'plan-pro', 'YEARLY', 'ACTIVE', '2026-01-01', '2026-12-31', 149999.00)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- Seed SLA Rules
INSERT INTO `sla_rules` (`rule_id`, `category_name`, `department_code`, `priority`, `sla_hours`, `warning_hours`, `escalation_level`) VALUES
('sla-001', 'Streetlight Defect', 'ELEC', 'HIGH', 24, 4, 1),
('sla-002', 'Garbage Overflow', 'SWM', 'HIGH', 12, 2, 1),
('sla-003', 'Pothole & Road Damage', 'ENG', 'MEDIUM', 72, 12, 2),
('sla-004', 'Water Supply Leakage', 'WATER', 'CRITICAL', 12, 2, 1)
ON DUPLICATE KEY UPDATE `sla_hours` = VALUES(`sla_hours`);

-- Seed GIS Layers
INSERT INTO `gis_layers` (`layer_id`, `layer_code`, `layer_name`, `icon`, `color`, `is_visible`) VALUES
('g-001', 'WARDS', 'Ward Boundaries', 'Map', '#2563eb', TRUE),
('g-002', 'COMPLAINTS', 'Active Complaints', 'AlertTriangle', '#ef4444', TRUE),
('g-003', 'WORKS', 'Development Works', 'HardHat', '#f59e0b', TRUE),
('g-004', 'ROADS', 'Major Roads & Streets', 'Navigation', '#64748b', TRUE)
ON DUPLICATE KEY UPDATE `layer_name` = VALUES(`layer_name`);

SET FOREIGN_KEY_CHECKS = 1;
