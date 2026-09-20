const mongoose = require('mongoose');
const {
  GENDER,
  CATEGORY,
  DISTRICT,
  TALUKA,
  DEGREE_TYPE,
  SCHOOL,
  DISCIPLINE,
  COURSE,
  ASPIRATIONAL_SECTOR,
  ENTREPRENEURSHIP_INCLINATION,
} = require('../constants/dropdowns');

const studentSchema = new mongoose.Schema(
  {
    // ── Free text fields ─────────────────────────────────────────
    student_name: {
      type: String,
      required: [true, 'Student name is required'],
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
    dob: {
      type: Date,
    },
    enrollment_no: {
      type: String,
      trim: true,
      sparse: true,
    },
    year_of_passing: {
      type: Number,
      min: [1980, 'Year too old'],
      max: [2100, 'Year invalid'],
    },

    // ── Dropdown fields ──────────────────────────────────────────
    gender: {
      type: String,
      enum: {
        values: GENDER,
        message: 'Invalid gender value',
      },
    },
    category: {
      type: String,
      enum: {
        values: CATEGORY,
        message: 'Invalid category value',
      },
    },
    taluka: {
      type: String,
      enum: {
        values: TALUKA,
        message: 'Invalid taluka value',
      },
    },
    district: {
      type: String,
      enum: {
        values: DISTRICT,
        message: 'Invalid district value',
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
    aspirational_sector: {
      type: String,
      enum: {
        values: ASPIRATIONAL_SECTOR,
        message: 'Invalid aspirational sector value',
      },
    },
    entrepreneurship_inclination: {
      type: String,
      enum: {
        values: ENTREPRENEURSHIP_INCLINATION,
        message: 'Invalid entrepreneurship inclination value',
      },
    },

    // ── Skill fields (multi-select / checkbox in Google Form) ────
    // Google Form sends comma-separated string → stored as array
    technical_skills: {
      type: [String],
      default: [],
    },
    soft_skills: {
      type: [String],
      default: [],
    },
    domain_specific: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Text index — enables ?search= query
studentSchema.index({
  student_name: 'text',
  email: 'text',
  district: 'text',
  course: 'text',
  school: 'text',
});

// Single field indexes for filter queries
studentSchema.index({ district: 1 });
studentSchema.index({ gender: 1 });
studentSchema.index({ degree_type: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ category: 1 });
studentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Student', studentSchema);