// routes/admissionRoutes.js
const express = require('express');
const router  = express.Router();

const { protect } = require('../middleware/protect');
const {
  getAdmissionRecords,
  getAdmissionRecordById,
  deleteAdmissionRecord,
} = require('../controllers/admissionController');

router.get   ('/admission-records',      protect, getAdmissionRecords);
router.get   ('/admission-records/:id',  protect, getAdmissionRecordById);
router.delete('/admission-records/:id',  protect, deleteAdmissionRecord);

module.exports = router;
