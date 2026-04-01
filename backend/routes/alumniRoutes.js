// routes/alumniRoutes.js
const express = require('express');
const router  = express.Router();

const { verifyWebhookSecret }  = require('../middleware/auth');
const { protect }              = require('../middleware/protect');  // ← ADD THIS
const {
  receiveAlumniWebhook,
  getAlumni,
  getAlumniById,
  deleteAlumni,
  getAlumniDropdowns,
} = require('../controllers/alumniController');


const { syncAlumni } = require('../services/sheetsSync');

router.post('/alumni/sync', protect, async (req, res) => {
  try {
    const result = await syncAlumni();
    res.json({ success: true, message: `Synced ${result.synced} alumni`, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Webhook — protected by API key only (Google Apps Script)
router.post('/alumni/webhook', verifyWebhookSecret, receiveAlumniWebhook);

// All below routes require admin login
router.get   ('/alumni',              protect, getAlumni);          // ← ADD protect
router.get   ('/alumni/dropdowns',    protect, getAlumniDropdowns); // ← ADD protect
router.get   ('/alumni/:id',          protect, getAlumniById);      // ← ADD protect
router.delete('/alumni/:id',          protect, deleteAlumni);       // ← ADD protect

module.exports = router;