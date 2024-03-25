const express = require('express');
const router = express.Router();
const { runMatchingProcess } = require('../controllers/matchController');
const { requireAuth, checkRole } = require('../middleware/requireAuth');

// Endpoint to trigger the matching process
router.post('/match', requireAuth, checkRole(['admin']), runMatchingProcess);

module.exports = router;
