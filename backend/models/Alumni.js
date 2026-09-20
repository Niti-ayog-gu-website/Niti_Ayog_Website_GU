// models/Alumni.js
const mongoose = require('mongoose');
const {
  GENDER,
  DEGREE_TYPE,
  SCHOOL,
  DISCIPLINE,
  COURSE,
//   YEAR_OF_PASSING,
  SECTOR,
  EMPLOYMENT_TYPE,
  SALARY,
  YEARS_OF_EXPERIENCE,
  CURRENTLY_EMPLOYED, 
  HIGHER_EDUCATION,
  SKILL_GAP_PERCEIVED,
  WOULD_RECOMMEND_GOA_JOBS,
} = require('../constants/alumniDropdowns');

const alumniSchema = new mongoose.Schema(
  {
    // ── Free text fields ─────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
    },
    enrollment_no: {
      type: String,
      trim: true,
      sparse: true,
    },
    current_role: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    higher_education_detail: {
      type: String,
      trim: true,
    },
    industry_feedback: {
      type: String,
      trim: true,
    },
    year_of_passing: {
        type: Number,
        min: [1980, 'Year too old'],
        max: [2100, 'Year invalid'],
    },
    // Checkbox field — stored as array like technical_skills in Student
    skills_used: {
      type: [String],
      default: [],
    },

    // ── Dropdown fields ──────────────────────────────────────────
    currently_employed: {
      type: String,
      enum: {
        values: CURRENTLY_EMPLOYED,
        message: 'Currently employed must be Yes or No',
      },
    },
    gender: {
      type: String,
      enum: {
        values: GENDER,
        message: 'Invalid gender value',
      },
    },
    degree_type: {
      type: String,
      enum: {
        values: DEGREE_TYPE,
        message: 'Invalid degree type value',
      },
    },
    school: {
      type: String,
      enum: {
        values: SCHOOL,
        message: 'Invalid school value',
      },
    },
    discipline: {
      type: String,
      enum: {
        values: DISCIPLINE,
        message: 'Invalid discipline value',
      },
    },
    course: {
      type: String,
      enum: {
        values: COURSE,
        message: 'Invalid course value',
      },
    },
    
    sector: {
      type: String,
      enum: {
        values: SECTOR,
        message: 'Invalid sector value',
      },
    },
    employment_type: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPE,
        message: 'Invalid employment type value',
      },
    },
    salary: {
      type: String,
      enum: {
        values: SALARY,
        message: 'Invalid salary value',
      },
    },
    years_of_experience: {
      type: String,
      enum: {
        values: YEARS_OF_EXPERIENCE,
        message: 'Invalid years of experience value',
      },
    },
    higher_education: {
      type: String,
      enum: {
        values: HIGHER_EDUCATION,
        message: 'Higher education must be Yes or No',
      },
    },
    skill_gap_perceived: {
      type: String,
      enum: {
        values: SKILL_GAP_PERCEIVED,
        message: 'Invalid skill gap value',
      },
    },
    would_recommend_goa_jobs: {
      type: String,
      enum: {
        values: WOULD_RECOMMEND_GOA_JOBS,
        message: 'Value must be Yes, No or Maybe',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
alumniSchema.index({
  name:         'text',
  email:        'text',
  company:      'text',
  current_role: 'text',
  location:     'text',
});

// Single field indexes for filters
alumniSchema.index({ gender:           1 });
alumniSchema.index({ degree_type:      1 });
alumniSchema.index({ course:           1 });
alumniSchema.index({ sector:           1 });
alumniSchema.index({ employment_type:  1 });
alumniSchema.index({ year_of_passing:  1 });
alumniSchema.index({ salary:           1 });
alumniSchema.index({ createdAt:       -1 });

module.exports = mongoose.model('Alumni', alumniSchema);