const express = require('express');
const router = express.Router();
const { queryAi } = require('../controllers/aiController');

router.post('/query', queryAi);

module.exports = router;
