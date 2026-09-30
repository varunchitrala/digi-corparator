const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Municipal Employees Directory
 * @route GET /api/corporation/hrms/employees
 */
const getEmployees = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT e.*, p.first_name, p.last_name, p.email, p.mobile, d.department_name, des.designation_name
       FROM employees e
       JOIN employee_personal_details p ON e.employee_id = p.employee_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       LEFT JOIN designations des ON e.designation_id = des.designation_id
       WHERE e.corporation_id = ?
       ORDER BY e.created_at DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Employee master fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch employees', error.message, 500);
  }
};

/**
 * @desc Register New Municipal Employee (EMP-2026-XXXXXX)
 * @route POST /api/corporation/hrms/employees
 */
const createEmployee = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { first_name = 'Amit', last_name = 'Verma', email = 'amit.verma@demomunicipal.gov.in', mobile = '9822099112', department_id = 'dept-001', designation_id = 'desig-002', ward_id = 'w-demo-024', employment_type = 'PERMANENT', basic_salary = 50000 } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const empNum = `EMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const empId = `emp-${Date.now()}`;

    // Retirement date (58 years from DOB assumption)
    const retDate = new Date();
    retDate.setFullYear(retDate.getFullYear() + 25);

    await connection.query(
      `INSERT INTO employees (employee_id, employee_code, corporation_id, department_id, designation_id, ward_id, employment_type, joining_date, status, retirement_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 'ACTIVE', ?)`,
      [empId, empNum, corpId, department_id, designation_id, ward_id, employment_type, retDate]
    );

    await connection.query(
      `INSERT INTO employee_personal_details (detail_id, employee_id, first_name, last_name, date_of_birth, gender, mobile, email, address)
       VALUES (?, ?, ?, ?, '1990-01-01', 'MALE', ?, ?, 'Ward 24 Quarters')`,
      [`pdet-${Date.now()}`, empId, first_name, last_name, mobile, email]
    );

    await connection.query(
      `INSERT INTO employee_salary_history (salary_id, employee_id, basic_salary, pay_grade, hra, da)
       VALUES (?, ?, ?, 'GRADE_B', ?, ?)`,
      [`sal-${Date.now()}`, empId, parseFloat(basic_salary), parseFloat(basic_salary) * 0.2, parseFloat(basic_salary) * 0.4]
    );

    await connection.commit();

    return sendSuccess(res, 'Employee registered successfully', { employee_id: empId, employee_code: empNum }, 201);
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Employee registration failed', error.message, 500);
  } finally {
    connection.release();
  }
};

/**
 * @desc Get Employee Profile & Salary Telemetry (With Strict Salary Privacy Guard)
 * @route GET /api/corporation/hrms/employees/:id
 */
const getEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT e.*, p.first_name, p.last_name, p.email, p.mobile, p.address, d.department_name, des.designation_name
       FROM employees e
       JOIN employee_personal_details p ON e.employee_id = p.employee_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       LEFT JOIN designations des ON e.designation_id = des.designation_id
       WHERE e.employee_id = ?`,
      [id]
    );

    if (rows.length === 0) return sendError(res, 'Employee not found', [], 404);
    const emp = rows[0];

    // Salary Privacy Guard: Only HR Admin, Super Admin, or the Employee themselves can view salary
    let salary = null;
    if (req.user && ['HR_ADMIN', 'CORPORATION_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      const [salRows] = await pool.query(`SELECT * FROM employee_salary_history WHERE employee_id = ?`, [id]);
      if (salRows.length > 0) salary = salRows[0];
    }

    const [postings] = await pool.query(`SELECT * FROM employee_posting_history WHERE employee_id = ? ORDER BY created_at DESC`, [id]);

    return sendSuccess(res, 'Employee details retrieved', {
      employee: emp,
      salary,
      postings
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch employee details', error.message, 500);
  }
};

/**
 * @desc Process Employee Transfer (Creates Posting History)
 * @route POST /api/corporation/hrms/transfers
 */
const transferEmployee = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { employee_id, new_department_id, new_designation_id, reason = 'Administrative Transfer' } = req.body;
    const userId = req.user ? req.user.user_id : 'u-corp-001';

    const [emps] = await connection.query(`SELECT department_id, designation_id FROM employees WHERE employee_id = ?`, [employee_id]);
    if (emps.length === 0) {
      await connection.rollback();
      return sendError(res, 'Employee not found', [], 404);
    }
    const oldDept = emps[0].department_id;
    const oldDesig = emps[0].designation_id;

    await connection.query(
      `INSERT INTO employee_posting_history (history_id, employee_id, old_department_id, new_department_id, old_designation_id, new_designation_id, effective_date, reason, approved_by_id)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)`,
      [`post-${Date.now()}`, employee_id, oldDept, new_department_id, oldDesig, new_designation_id, reason, userId]
    );

    await connection.query(`UPDATE employees SET department_id = ?, designation_id = ? WHERE employee_id = ?`, [new_department_id, new_designation_id, employee_id]);

    await connection.commit();

    return sendSuccess(res, 'Employee transfer processed successfully', { employee_id });
  } catch (error) {
    await connection.rollback();
    return sendError(res, 'Employee transfer failed', error.message, 500);
  } finally {
    connection.release();
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeDetails,
  transferEmployee
};
