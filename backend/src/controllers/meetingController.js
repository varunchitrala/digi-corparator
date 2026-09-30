const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getMeetings = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM meetings ORDER BY meeting_date DESC`);
    return sendSuccess(res, 'Meetings list fetched', rows);
  } catch (error) {
    return sendError(res, 'Failed to fetch meetings', error.message, 500);
  }
};

const createMeeting = async (req, res) => {
  try {
    const { meeting_title, meeting_type, meeting_date, venue, agenda_summary } = req.body;
    const meetingId = `m-${Date.now()}`;
    const corpId = req.user ? req.user.corporation_id || 'c-demo-001' : 'c-demo-001';

    await pool.query(
      `INSERT INTO meetings (meeting_id, corporation_id, ward_id, meeting_title, meeting_type, meeting_date, venue, status, agenda_summary)
       VALUES (?, ?, 'w-demo-024', ?, ?, ?, ?, 'SCHEDULED', ?)`,
      [meetingId, corpId, meeting_title, meeting_type || 'WARD_MEETING', meeting_date, venue, agenda_summary || '']
    );

    return sendSuccess(res, 'Meeting scheduled successfully', { meeting_id: meetingId }, 201);
  } catch (error) {
    return sendError(res, 'Failed to schedule meeting', error.message, 500);
  }
};

module.exports = {
  getMeetings,
  createMeeting
};
