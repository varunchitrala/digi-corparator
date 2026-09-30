const express = require('express');
const router = express.Router();
const { getWorks, createWork, updateProgress } = require('../controllers/workController');

router.get('/', getWorks);
router.post('/', createWork);
router.put('/:id/progress', updateProgress);

module.exports = router;
