const express = require('express');
const router = express.Router();
const { getProposals, createProposal } = require('../controllers/proposalController');

router.get('/', getProposals);
router.post('/', createProposal);

module.exports = router;
