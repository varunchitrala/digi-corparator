const express = require('express');
const router = express.Router();
const { getMeetings, createMeeting } = require('../controllers/meetingController');

router.get('/', getMeetings);
router.post('/', createMeeting);

module.exports = router;
