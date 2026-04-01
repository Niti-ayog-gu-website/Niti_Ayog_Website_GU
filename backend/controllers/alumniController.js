// controllers/alumniController.js
const Alumni    = require('../models/Alumni');
const dropdowns = require('../constants/alumniDropdowns');

// ─────────────────────────────────────────────────────────────────
// POST /api/alumni/webhook
// Called by Google Apps Script on every alumni form submission
// ─────────────────────────────────────────────────────────────────
const receiveAlumniWebhook = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      enrollment_no,
      degree_type,
      school,
      discipline,
      course,
      year_of_passing,
      current_role,
      company,
      sector,
      employment_type,
      salary,
      location,
      years_of_experience,
      currently_employed,
      higher_education,
      higher_education_detail,
      skill_gap_perceived,
      would_recommend_goa_jobs,
      industry_feedback,
      skills_used, 
    } = req.body;

    const payload = {
      name,
      email,
      phone,
      gender,
      enrollment_no,
      degree_type,
      school,
      discipline,
      course,
      year_of_passing,year_of_passing: year_of_passing ? Number(year_of_passing) : undefined,
      current_role,
      company,
      sector,
      employment_type,
      salary,
      location,
      years_of_experience,
      currently_employed,
      higher_education,
      higher_education_detail,
      skill_gap_perceived,
      would_recommend_goa_jobs,
      industry_feedback,
      skills_used: parseToArray(skills_used),
    };

    // Remove keys with undefined value
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    // Upsert: insert new OR update existing record matched by email
    const alumni = await Alumni.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Alumni data saved successfully',
      data: alumni,
    });
  } catch (error) {
    console.error('Alumni webhook error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/alumni
// Query params:
//   page=1 | limit=15
//   search | gender | degree_type | course | sector
//   employment_type | salary | year_of_passing | higher_education
//   would_recommend_goa_jobs | years_of_experience
// ─────────────────────────────────────────────────────────────────
const getAlumni = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 15, 100);
    const skip  = (page - 1) * limit;

    const filter = {};

    if (req.query.search)       filter.$text             = { $search: req.query.search };
    if (req.query.gender)       filter.gender             = req.query.gender;
    if (req.query.degree_type)  filter.degree_type        = req.query.degree_type;
    if (req.query.course)       filter.course             = req.query.course;
    if (req.query.sector)       filter.sector             = req.query.sector;
    if (req.query.employment_type)  filter.employment_type  = req.query.employment_type;
    if (req.query.salary)           filter.salary           = req.query.salary;
    if (req.query.year_of_passing)  filter.year_of_passing  = req.query.year_of_passing;
    if (req.query.higher_education) filter.higher_education = req.query.higher_education;
    if (req.query.years_of_experience) filter.years_of_experience = req.query.years_of_experience;
    if (req.query.would_recommend_goa_jobs) {
      filter.would_recommend_goa_jobs = req.query.would_recommend_goa_jobs;
    }
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.currently_employed) {
      filter.currently_employed = req.query.currently_employed;
    }
    if (req.query.school)      filter.school      = req.query.school;
    if (req.query.discipline)  filter.discipline  = req.query.discipline;
    
    const [alumniList, total] = await Promise.all([
      Alumni.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Alumni.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: alumniList,
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
    console.error('getAlumni error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/alumni/:id
// ─────────────────────────────────────────────────────────────────
const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id).select('-__v');
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    res.status(200).json({ success: true, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/alumni/:id
// ─────────────────────────────────────────────────────────────────
const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    res.status(200).json({ success: true, message: 'Alumni deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/alumni/dropdowns
// Returns all alumni dropdown values — frontend calls once on load
// ─────────────────────────────────────────────────────────────────
const getAlumniDropdowns = (req, res) => {
  res.status(200).json({ success: true, data: dropdowns });
};

module.exports = {
  receiveAlumniWebhook,
  getAlumni,
  getAlumniById,
  deleteAlumni,
  getAlumniDropdowns,
};