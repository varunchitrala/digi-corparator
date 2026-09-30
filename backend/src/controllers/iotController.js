const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get IoT Devices & Command Centre Sensors
 * @route GET /api/corporation/iot/devices
 */
const getIotDevices = async (req, res) => {
  try {
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const [devices] = await pool.query(
      `SELECT d.*, w.ward_name
       FROM iot_devices d
       LEFT JOIN wards w ON d.ward_id = w.ward_id
       WHERE d.corporation_id = ?
       ORDER BY d.created_at DESC`,
      [corpId]
    );

    return sendSuccess(res, 'Smart city IoT devices telemetry fetched', { devices, total_online: devices.filter(d => d.operating_status === 'ONLINE').length });
  } catch (error) {
    return sendError(res, 'Failed to fetch IoT telemetry', error.message, 500);
  }
};

/**
 * @desc Register IoT Device (IOT-2026-XXXXXX)
 * @route POST /api/corporation/iot/devices
 */
const createIotDevice = async (req, res) => {
  try {
    const { device_name = 'Ward 24 Drainage Flood Level Sensor 1', ward_id = 'w-demo-024', device_type = 'WATER_LEVEL' } = req.body;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    const devNum = `IOT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const devId = `iot-${Date.now()}`;

    await pool.query(
      `INSERT INTO iot_devices (device_id, device_code, corporation_id, ward_id, device_name, device_type, battery_pct, operating_status)
       VALUES (?, ?, ?, ?, ?, ?, 98, 'ONLINE')`,
      [devId, devNum, corpId, ward_id, device_name, device_type]
    );

    return sendSuccess(res, 'IoT Sensor registered', { device_id: devId, device_code: devNum }, 201);
  } catch (error) {
    return sendError(res, 'IoT registration failed', error.message, 500);
  }
};

module.exports = {
  getIotDevices,
  createIotDevice
};
