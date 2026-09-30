const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const { validateGeofenceRadius } = require('../services/attendanceService');

/**
 * @desc Get Attendance Register for Corporation
 * @route GET /api/hrms/attendance
 */
const getAttendanceRegister = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';
    const [rows] = await pool.query(
      `SELECT att.*, e.employee_code, p.first_name, p.last_name, d.department_name
       FROM attendance_records att
       JOIN employees e ON att.employee_id = e.employee_id
       JOIN employee_personal_details p ON e.employee_id = p.employee_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       WHERE e.corporation_id = ?
       ORDER BY att.attendance_date DESC`,
      [corpId]
    );
    return sendSuccess(res, 'Attendance register fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch attendance register', error.message, 500);
  }
};

/**
 * @desc Employee Geofenced Check-In
 * @route POST /api/hrms/attendance/check-in
 */
const processCheckIn = async (req, res) => {
  try {
    const { employee_id = 'emp-001', latitude = 19.8762, longitude = 75.3433 } = req.body;

    // Geofence Radius Validation (200m)
    const geoVal = validateGeofenceRadius(latitude, longitude);
    if (!geoVal.valid) {
      return sendError(res, geoVal.reason, [], 400);
    }

    const attId = `att-${Date.now()}`;
    await pool.query(
      `INSERT INTO attendance_records (attendance_id, employee_id, attendance_date, check_in, status, source, latitude, longitude)
       VALUES (?, ?, CURDATE(), CURTIME(), 'PRESENT', 'GPS', ?, ?)
       ON DUPLICATE KEY UPDATE check_in = CURTIME(), status = 'PRESENT'`,
      [attId, employee_id, parseFloat(latitude), parseFloat(longitude)]
    );

    return sendSuccess(res, `Check-In Successful! Distance from municipal office: ${geoVal.distance}m`);
  } catch (error) {
    return sendError(res, 'Check-In failed', error.message, 500);
  }
};

module.exports = {
  getAttendanceRegister,
  processCheckIn
};
