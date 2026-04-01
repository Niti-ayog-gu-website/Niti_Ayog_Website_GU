// arpita u added this 

const express = require('express');
const router  = express.Router();

const { protect, superAdminOnly } = require('../middleware/protect');
const {
  loginAdmin,
  getMe,
  createAdmin,
  getAllAdmins,
  deactivateAdmin,
  changePassword,
} = require('../controllers/adminController');

// Public
router.post('/admin/login', loginAdmin);

// Protected — any admin
router.get ('/admin/me',              protect, getMe);
router.put ('/admin/change-password', protect, changePassword);

// Superadmin only
router.post('/admin/create',          protect, superAdminOnly, createAdmin);
router.get ('/admin/all',             protect, superAdminOnly, getAllAdmins);
router.put ('/admin/:id/deactivate',  protect, superAdminOnly, deactivateAdmin);

module.exports = router;