const express = require('express');
const router  = express.Router();

const { verifyWebhookSecret } = require('../middleware/auth');
const { protect }              = require('../middleware/protect'); 
const {
  receiveWebhook,
  getStudents,
  getStudentById,
  deleteStudent,
  getDropdowns,
} = require('../controllers/studentController');


const { syncStudents } = require('../services/sheetsSync');

// Manual sync trigger — admin calls this
router.post('/students/sync', protect, async (req, res) => {
  try {
    const result = await syncStudents();
    res.json({ success: true, message: `Synced ${result.synced} students`, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// Webhook — protected by API key (Google Apps Script calls this)
router.post('/webhook', verifyWebhookSecret, receiveWebhook);

// Student CRUD
router.get   ('/students',      protect, getStudents);       
router.get   ('/students/:id',  protect, getStudentById);    
router.delete('/students/:id',  protect, deleteStudent);     
router.get   ('/dropdowns',     protect, getDropdowns);      


// Dropdown values for frontend filters
// router.get('/dropdowns', getDropdowns);

module.exports = router;