require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],   // arpita-- added , 'Authorization'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/adminRoutes')); 
app.use('/api', require('./routes/studentRoutes'));
app.use('/api', require('./routes/alumniRoutes')); 

app.get('/', (req, res) => {
  res.json({ status: 'Student Management API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const { syncStudents, syncAlumni } = require('./services/sheetsSync');

// Sync on startup
syncStudents().catch(console.error);
syncAlumni().catch(console.error);

// Auto sync every 5 minutes
setInterval(() => {
  syncStudents().catch(console.error);
  syncAlumni().catch(console.error);
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});