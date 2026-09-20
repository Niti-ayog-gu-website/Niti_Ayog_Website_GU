// controllers/adminController.js
const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');

// Helper: generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/login
// ─────────────────────────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find admin by email — include password for comparison
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Compare password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id   : admin._id,
        name : admin.name,
        email: admin.email,
        role : admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/me
// Returns logged in admin details
// ─────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id   : req.admin._id,
      name : req.admin.name,
      email: req.admin.email,
      role : req.admin.role,
    },
  });
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/create
// Only superadmin can create new admins
// ─────────────────────────────────────────────────────────────────
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id   : admin._id,
        name : admin.name,
        email: admin.email,
        role : admin.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/all
// Superadmin sees all admins
// ─────────────────────────────────────────────────────────────────
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// PUT /api/admin/:id/deactivate
// Superadmin can deactivate an admin account
// ─────────────────────────────────────────────────────────────────
const deactivateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Admin deactivated successfully',
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// PUT /api/admin/change-password
// Logged in admin changes their own password
// ─────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin._id).select('+password');

    // Check current password
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password — pre save hook will hash it
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/forgot-password
// Sends a 6-digit OTP to the admin's registered email
// ─────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const admin = await Admin.findOne({ email });

    // Always return success to prevent email enumeration attacks
    if (!admin) {
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, an OTP has been sent',
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 10 minutes
    admin.resetOtp       = otp;
    admin.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save({ validateBeforeSave: false });

    // Send OTP email
    await sendEmail({
      to      : admin.email,
      subject : 'Your Password Reset OTP',
      html    : `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi <strong>${admin.name}</strong>,</p>
          <p>Use the OTP below to reset your password. It is valid for <strong>10 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                      text-align: center; padding: 20px; background: #f4f4f4;
                      border-radius: 8px; margin: 24px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">
            If you did not request this, please ignore this email.
            Your password will not change.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered email address',
    });

  } catch (error) {
    console.error('forgotPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/verify-otp
// Verifies the OTP — returns a short-lived reset token on success
// ─────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    const admin = await Admin.findOne({
      email,
      resetOtp      : otp,
      resetOtpExpire: { $gt: new Date() },   // OTP must not be expired
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // OTP is valid — issue a short-lived reset token (15 min)
    const resetToken = jwt.sign(
      { id: admin._id, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Clear OTP from DB so it can't be reused
    admin.resetOtp       = null;
    admin.resetOtpExpire = null;
    await admin.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,           // frontend stores this temporarily
    });

  } catch (error) {
    console.error('verifyOtp error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/admin/reset-password
// Uses the resetToken from verifyOtp to set a new password
// ─────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired',
      });
    }

    // Extra safety — ensure token was issued for password reset only
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Set new password — pre-save hook in Admin.js will hash it
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });

  } catch (error) {
    console.error('resetPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  loginAdmin,
  getMe,
  createAdmin,
  getAllAdmins,
  deactivateAdmin,
  changePassword,
  forgotPassword,   
  verifyOtp,       
  resetPassword, 
};