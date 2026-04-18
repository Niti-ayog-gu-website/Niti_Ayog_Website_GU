// models/Admin.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Name is required'],
      trim     : true,
    },
    email: {
      type     : String,
      required : [true, 'Email is required'],
      unique   : true,
      lowercase: true,
      trim     : true,
      match    : [/^\S+@\S+\.\S+$/, 'Enter a valid email'],
    },
    password: {
      type     : String,
      required : [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select   : false, // never return password in queries by default
    },
    role: {
      type   : String,
      enum   : ['superadmin', 'admin'],
      default: 'admin',
    },
    isActive: {
      type   : Boolean,
      default: true,
    },
    // ── Forgot Password OTP ───────
    resetOtp: {
      type   : String,
      default: null,
    },
    resetOtpExpire: {
      type   : Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving// -- arpita changed next to await
adminSchema.pre('save', async function () {
  // Only hash if password field was modified
  if (!this.isModified('password')) return ;
  const salt   = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);