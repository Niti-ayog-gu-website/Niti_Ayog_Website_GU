// controllers/admissionController.js
const AdmissionRecord = require('../models/AdmissionRecord');

// ─────────────────────────────────────────────────────────────────
// GET /api/admission-records
// Query params: page, limit, search, programme, category, gender,
//               admission_batch, ou_name
// ─────────────────────────────────────────────────────────────────
const getAdmissionRecords = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 500, 1000);
    const skip  = (page - 1) * limit;

    const filter = {};

    if (req.query.programme)      filter.programme      = req.query.programme;
    if (req.query.category)       filter.category       = req.query.category;
    if (req.query.gender)         filter.gender         = req.query.gender;
    if (req.query.admission_batch) filter.admission_batch = req.query.admission_batch;
    if (req.query.ou_name)        filter.ou_name        = req.query.ou_name;
    if (req.query.pwd_applicable) filter.pwd_applicable = req.query.pwd_applicable;

    const [records, total] = await Promise.all([
      AdmissionRecord.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      AdmissionRecord.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('getAdmissionRecords error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admission-records/:id
// ─────────────────────────────────────────────────────────────────
const getAdmissionRecordById = async (req, res) => {
  try {
    const record = await AdmissionRecord.findById(req.params.id).select('-__v');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/admission-records/:id
// ─────────────────────────────────────────────────────────────────
const deleteAdmissionRecord = async (req, res) => {
  try {
    const record = await AdmissionRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAdmissionRecords, getAdmissionRecordById, deleteAdmissionRecord };
