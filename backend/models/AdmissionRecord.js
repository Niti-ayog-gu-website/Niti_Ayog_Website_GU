// models/AdmissionRecord.js
const mongoose = require('mongoose');

const admissionRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    enrollment_no: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
      trim: true,
    },
    roll_number: { type: String, trim: true },
    admission_batch: { type: String, trim: true },
    programme_code: { type: String, trim: true },
    programme: { type: String, trim: true },
    ou_name: { type: String, trim: true },
    validity_start: { type: String, trim: true },
    category: { type: String, trim: true },
    gender: { type: String, trim: true },
    pwd_applicable: { type: String, trim: true },

    // Catch-all: any uploaded column that doesn't match one of the fixed
    // fields above lands here as { originalHeader: value }, keyed exactly
    // as the admin named it during mapping. This is what lets a brand new
    // column in a future sheet get stored WITHOUT a code change — the
    // admin just maps it to "extra" instead of a predefined field.
    extra_fields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

admissionRecordSchema.index({ programme: 1 });
admissionRecordSchema.index({ category: 1 });
admissionRecordSchema.index({ admission_batch: 1 });
admissionRecordSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AdmissionRecord', admissionRecordSchema);