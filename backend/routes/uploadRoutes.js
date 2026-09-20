// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const { protect } = require('../middleware/protect');
const { previewUpload, confirmUpload, exportData } = require('../controllers/uploadController');

const tmpDir = path.join(__dirname, '..', 'uploads', 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.xlsx', '.xls', '.csv'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx, .xls or .csv files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post('/upload/preview', protect, upload.single('file'), previewUpload);
router.post('/upload/confirm', protect, confirmUpload);
router.get('/export/:type', protect, exportData);

module.exports = router;