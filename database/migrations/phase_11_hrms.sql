-- =============================================================================
-- PHASE 11: HRMS & EMPLOYEE MANAGEMENT SCHEMA EXPANSION
-- Database: digital_corporator
-- =============================================================================

USE `digital_corporator`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DESIGNATIONS TABLE
CREATE TABLE IF NOT EXISTS `designations` (
  `designation_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `designation_code` VARCHAR(50) NOT NULL UNIQUE,
  `designation_name` VARCHAR(150) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `grade` VARCHAR(50) DEFAULT 'GRADE_B',
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. EMPLOYEES MASTER TABLE
CREATE TABLE IF NOT EXISTS `employees` (
  `employee_id` VARCHAR(36) PRIMARY KEY,
  `employee_code` VARCHAR(50) UNIQUE NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `corporation_id` VARCHAR(36) NOT NULL,
  `department_id` VARCHAR(36) DEFAULT NULL,
  `designation_id` VARCHAR(36) DEFAULT NULL,
  `ward_id` VARCHAR(36) DEFAULT NULL,
  `reporting_manager_id` VARCHAR(36) DEFAULT NULL,
  `employment_type` ENUM('PERMANENT', 'CONTRACT', 'TEMPORARY', 'DAILY_WAGE', 'CONSULTANT', 'OUTSOURCED', 'INTERN') DEFAULT 'PERMANENT',
  `joining_date` DATE NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'PROBATION', 'SUSPENDED', 'ON_NOTICE', 'RESIGNED', 'RETIRED', 'TERMINATED', 'DECEASED') DEFAULT 'ACTIVE',
  `probation_end` DATE DEFAULT NULL,
  `retirement_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. EMPLOYEE PERSONAL DETAILS TABLE
CREATE TABLE IF NOT EXISTS `employee_personal_details` (
  `detail_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'MALE',
  `mobile` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pdet_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EMPLOYEE POSTING HISTORY TABLE
CREATE TABLE IF NOT EXISTS `employee_posting_history` (
  `history_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `old_department_id` VARCHAR(36) DEFAULT NULL,
  `new_department_id` VARCHAR(36) NOT NULL,
  `old_designation_id` VARCHAR(36) DEFAULT NULL,
  `new_designation_id` VARCHAR(36) NOT NULL,
  `effective_date` DATE NOT NULL,
  `reason` TEXT DEFAULT NULL,
  `approved_by_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_post_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `attendance_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `attendance_date` DATE NOT NULL,
  `check_in` TIME DEFAULT NULL,
  `check_out` TIME DEFAULT NULL,
  `status` ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'LATE', 'WEEK_OFF', 'HOLIDAY') DEFAULT 'PRESENT',
  `source` ENUM('MANUAL', 'GPS', 'BIOMETRIC', 'MOBILE') DEFAULT 'GPS',
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_emp_att_date` (`employee_id`, `attendance_date`),
  CONSTRAINT `fk_att_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. LEAVE TYPES TABLE
CREATE TABLE IF NOT EXISTS `leave_types` (
  `leave_type_id` VARCHAR(36) PRIMARY KEY,
  `corporation_id` VARCHAR(36) NOT NULL,
  `leave_code` VARCHAR(50) NOT NULL UNIQUE,
  `leave_name` VARCHAR(150) NOT NULL,
  `annual_quota` INT NOT NULL DEFAULT 12,
  `carry_forward_allowed` BOOLEAN DEFAULT TRUE,
  `status` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. LEAVE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS `leave_applications` (
  `leave_app_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL,
  `leave_type_id` VARCHAR(36) NOT NULL,
  `from_date` DATE NOT NULL,
  `to_date` DATE NOT NULL,
  `days` INT NOT NULL DEFAULT 1,
  `reason` TEXT NOT NULL,
  `status` ENUM('SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'SUBMITTED',
  `approved_by_id` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lapp_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. EMPLOYEE SALARY HISTORY TABLE (Restricted HR Privacy)
CREATE TABLE IF NOT EXISTS `employee_salary_history` (
  `salary_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL UNIQUE,
  `basic_salary` DECIMAL(15,2) NOT NULL DEFAULT '45000.00',
  `pay_grade` VARCHAR(50) DEFAULT 'GRADE_B',
  `hra` DECIMAL(15,2) DEFAULT '9000.00',
  `da` DECIMAL(15,2) DEFAULT '18000.00',
  `status` ENUM('ACTIVE', 'ARCHIVED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sal_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. EMPLOYEE EXITS TABLE
CREATE TABLE IF NOT EXISTS `employee_exits` (
  `exit_id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(36) NOT NULL UNIQUE,
  `exit_type` ENUM('RESIGNATION', 'RETIREMENT', 'TERMINATION', 'CONTRACT_END', 'DECEASED') DEFAULT 'RESIGNATION',
  `notice_date` DATE NOT NULL,
  `last_working_date` DATE NOT NULL,
  `asset_cleared` BOOLEAN DEFAULT FALSE,
  `finance_cleared` BOOLEAN DEFAULT FALSE,
  `status` ENUM('SUBMITTED', 'UNDER_CLEARANCE', 'COMPLETED') DEFAULT 'UNDER_CLEARANCE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_exit_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SEED DESIGNATIONS, LEAVE TYPES & EMPLOYEES
INSERT INTO `designations` (`designation_id`, `corporation_id`, `designation_code`, `designation_name`, `grade`) VALUES
('desig-001', 'c-demo-001', 'DES-EE', 'Executive Engineer', 'GRADE_A'),
('desig-002', 'c-demo-001', 'DES-AE', 'Assistant Engineer', 'GRADE_B'),
('desig-003', 'c-demo-001', 'DES-JE', 'Junior Engineer', 'GRADE_C'),
('desig-004', 'c-demo-001', 'DES-SI', 'Sanitation Inspector', 'GRADE_C')
ON DUPLICATE KEY UPDATE `designation_name` = VALUES(`designation_name`);

INSERT INTO `leave_types` (`leave_type_id`, `corporation_id`, `leave_code`, `leave_name`, `annual_quota`) VALUES
('ltype-001', 'c-demo-001', 'LV-CL', 'Casual Leave', 12),
('ltype-002', 'c-demo-001', 'LV-SL', 'Sick Leave', 10),
('ltype-003', 'c-demo-001', 'LV-EL', 'Earned Leave', 30),
('ltype-004', 'c-demo-001', 'LV-ML', 'Maternity Leave', 180)
ON DUPLICATE KEY UPDATE `leave_name` = VALUES(`leave_name`);

-- SEED DEMO EMPLOYEE FOR OFFICER WATER
INSERT INTO `employees` (`employee_id`, `employee_code`, `user_id`, `corporation_id`, `department_id`, `designation_id`, `ward_id`, `employment_type`, `joining_date`, `status`, `retirement_date`) VALUES
('emp-001', 'EMP-2026-000001', 'u-dept-001', 'c-demo-001', 'dept-001', 'desig-001', 'w-demo-024', 'PERMANENT', '2020-01-10', 'ACTIVE', '2045-01-10')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `employee_personal_details` (`detail_id`, `employee_id`, `first_name`, `last_name`, `date_of_birth`, `gender`, `mobile`, `email`, `address`) VALUES
('pdet-001', 'emp-001', 'Sanjay', 'Kulkarni', '1985-05-15', 'MALE', '9822011223', 'officer.water@demomunicipal.gov.in', 'Civil Lines Ward 24')
ON DUPLICATE KEY UPDATE `first_name` = VALUES(`first_name`);

INSERT INTO `employee_salary_history` (`salary_id`, `employee_id`, `basic_salary`, `pay_grade`, `hra`, `da`) VALUES
('sal-001', 'emp-001', 65000.00, 'GRADE_A', 13000.00, 26000.00)
ON DUPLICATE KEY UPDATE `basic_salary` = VALUES(`basic_salary`);

SET FOREIGN_KEY_CHECKS = 1;
