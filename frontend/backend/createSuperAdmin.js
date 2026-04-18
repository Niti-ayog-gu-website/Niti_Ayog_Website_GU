// createSuperAdmin.js  ← run once, then delete this file
require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('./models/Admin');

const create = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('Superadmin already exists');
    process.exit();
  }

  await Admin.create({
    name    : 'Super Admin',
    email   : 'admin@example.com',   // ← change this
    password: 'admin123',            // ← change this
    role    : 'superadmin',
  });

  console.log('Superadmin created successfully');
  process.exit();
};

create();