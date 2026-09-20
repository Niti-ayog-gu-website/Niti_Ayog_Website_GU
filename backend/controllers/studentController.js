const Student   = require('../models/Student');
const dropdowns = require('../constants/dropdowns');

// Helper: "React, Node.js, MongoDB" → ['React', 'Node.js', 'MongoDB']
const parseToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  return value.split(',').map((v) => v.trim()).filter(Boolean);
};

// ─────────────────────────────────────────────────────────────────
// POST /api/webhook
// Called by Google Apps Script on every new form submission
// ─────────────────────────────────────────────────────────────────
const receiveWebhook = async (req, res) => {
  try {
    const {
      student_name,
      email,
      phone,
      gender,
      dob,
      category,
      taluka,
      district,
      enrollment_no,
      degree_type,
      school,
      discipline,
      course,
      year_of_passing,
      aspirational_sector,
      entrepreneurship_inclination,
      technical_skills,
      soft_skills,
      domain_specific,
    } = req.body;

    const payload = {
      student_name,
      email,
      phone,
      dob: dob ? new Date(dob) : undefined,
      enrollment_no,
      year_of_passing: year_of_passing ? Number(year_of_passing) : undefined,
      gender,
      category,
      taluka,
      district,
      degree_type,
      school,
      discipline,
      course,
      aspirational_sector,
      entrepreneurship_inclination,
      technical_skills : parseToArray(technical_skills),
      soft_skills      : parseToArray(soft_skills),
      domain_specific  : parseToArray(domain_specific),
    };

    // Remove keys with undefined value
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    // Upsert: insert new OR update existing record matched by email
    const student = await Student.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: payload },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student saved successfully',
      data: student,
    });
  } catch (error) {
    console.error('Webhook error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/students
// Query params:
//   page=1 | limit=15 | search=name
//   gender | district | degree_type | course | category | discipline
// ─────────────────────────────────────────────────────────────────
const getStudents = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 15, 100);
    const skip  = (page - 1) * limit;

    const filter = {};

    if (req.query.search)     filter.$text      = { $search: req.query.search };
    if (req.query.gender)     filter.gender      = req.query.gender;
    if (req.query.district)   filter.district    = req.query.district;
    if (req.query.degree_type) filter.degree_type = req.query.degree_type;
    if (req.query.course)     filter.course      = req.query.course;
    if (req.query.category)   filter.category    = req.query.category;
    if (req.query.discipline) filter.discipline  = req.query.discipline;
    if (req.query.school)     filter.school      = req.query.school;
    if (req.query.entrepreneurship_inclination) {
      filter.entrepreneurship_inclination = req.query.entrepreneurship_inclination;
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Student.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages : Math.ceil(total / limit),
        hasNext    : skip + limit < total,
        hasPrev    : page > 1,
      },
    });
  } catch (error) {
    console.error('getStudents error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/students/:id
// ─────────────────────────────────────────────────────────────────
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/students/:id
// ─────────────────────────────────────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/dropdowns
// Returns all dropdown option arrays — frontend calls this once on load
// ─────────────────────────────────────────────────────────────────
const getDropdowns = (req, res) => {
  res.status(200).json({ success: true, data: dropdowns });
};

module.exports = {
  receiveWebhook,
  getStudents,
  getStudentById,
  deleteStudent,
  getDropdowns,
};