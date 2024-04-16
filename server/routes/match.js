const express = require('express');
const router = express.Router();
const { runMatchingProcess, resetMatching } = require('../controllers/matchController');
const { requireAuth, checkRole } = require('../middleware/requireAuth');

// Endpoint to trigger the matching process
router.post('/match', requireAuth, checkRole(['admin']), runMatchingProcess);

// Reset matches
router.post('/reset', requireAuth, checkRole(['admin']), resetMatching);


module.exports = router;
