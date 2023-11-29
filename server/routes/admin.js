const express = require('express');
const { requireAuth, checkRole } = require('../middleware/requireAuth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth);
router.use(checkRole(['admin']));

router.post('/create-user', adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.patch('/update-user/:id', adminController.updateUserRole);

// Additional routes...

module.exports = router;

