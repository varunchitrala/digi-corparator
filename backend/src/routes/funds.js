const express = require('express');
const router = express.Router();
const { getBudgets } = require('../controllers/fundController');

router.get('/', getBudgets);

module.exports = router;
