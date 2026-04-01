const sheets  = require('../config/googleSheets');
const Student = require('../models/Student');
const Alumni  = require('../models/Alumni');

// Skills parser — handles "MS Office (Word, Excel, PowerPoint), Python"
// Splits on comma only when NOT inside parentheses
const parseSkills = (val) => {
  if (!val) return [];
  const results = [];
  let depth = 0, current = '';
  for (const ch of val) {
    if (ch === '(')      { depth++; current += ch; }
    else if (ch === ')') { depth--; current += ch; }
    else if (ch === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) results.push(trimmed);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) results.push(current.trim());
  return results;
};

// Clean ₹ and en-dash from salary → match backend enum
const cleanSalary = (raw) => {
  if (!raw) return '';
  let s = raw.replace(/₹/g, '').replace(/–/g, '-').trim();
  const map = {
    'below 2 lpa':       'Below 2 LPA',
    '2-5 lpa':           '2-5 LPA',
    '5-8 lpa':           '5-8 LPA',
    '8-12 lpa':          '8-12 LPA',
    '12-18 lpa':         '12-18 LPA',
    '18 lpa+':           '18 LPA+',
    'prefer not to say': 'Prefer not to say',
  };
  return map[s.toLowerCase()] || s;
};

// ─────────────────────────────────────────────────────────────────
// SYNC STUDENTS
// Exact column indexes from your sheet:
// [0]  Timestamp
// [1]  Student Name
// [2]  Email Address
// [3]  Contact Number
// [4]  Gender
// [5]  Date of birth
// [6]  Category
// [7]  Taluka
// [8]  District
// [9]  Enrollment No
// [10] Degree
// [11] School
// [12] Discipline
// [13] Course
// [14] Passing Year
// [15] Aspirational Sector
// [16] Entrepreneurship Inclination
// [17] Hard Skills
// [18] Soft Skills
// [19] Domain Specfic
// [20] Email Address (duplicate — ignored)
// [21] Column 21 (ignored)
// ─────────────────────────────────────────────────────────────────
const syncStudents = async () => {
  try {
    const spreadsheetId = process.env.STUDENT_SHEET_ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form Responses 1!A:V',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.log('No student data in sheet.');
      return { synced: 0, errors: 0 };
    }

    const dataRows = rows.slice(1);
    console.log(`Found ${dataRows.length} student rows`);

    let synced = 0, errors = 0;

    for (const row of dataRows) {
      try {
        const getIdx = (idx) => (row[idx] || '').toString().trim();

        const email = getIdx(2);
        if (!email) {
          console.log('Skipping row — no email');
          continue;
        }

        const payload = {
          student_name:                 getIdx(1),
          email:                        email.toLowerCase(),
          phone:                        getIdx(3),
          gender:                       getIdx(4),
          dob:                          getIdx(5),
          category:                     getIdx(6),
          taluka:                       getIdx(7),
          district:                     getIdx(8),
          enrollment_no:                getIdx(9),
          degree_type:                  getIdx(10),
          school:                       getIdx(11),
          discipline:                   getIdx(12),
          course:                       getIdx(13),
year_of_passing: (() => {
  const raw = getIdx(14);
  // Extract all 4-digit years from string, take the last one
  const years = raw.match(/\d{4}/g);
  if (!years) return undefined;
  const yr = Number(years[years.length - 1]);
  return (yr > 1900 && yr < 2100) ? yr : undefined;
})(),
         aspirational_sector:          getIdx(15),
          entrepreneurship_inclination: getIdx(16),
          technical_skills:             parseSkills(getIdx(17)),
          soft_skills:                  parseSkills(getIdx(18)),
          domain_specific:              parseSkills(getIdx(19)),
        };

        // Debug first row
        if (synced === 0 && errors === 0) {
          console.log('\nFirst student row mapped:');
          Object.entries(payload).forEach(([k, v]) => console.log(`  ${k}: ${JSON.stringify(v)}`));
        }

        Object.keys(payload).forEach(k => {
          if (payload[k] === undefined || payload[k] === '' ||
             (Array.isArray(payload[k]) && payload[k].length === 0)) {
            delete payload[k];
          }
        });

        await Student.findOneAndUpdate(
          { email: payload.email },
          { $set: payload },
          { upsert: true, new: true, runValidators: false }
        );
        synced++;
      } catch (err) {
        console.error('Student row error:', err.message);
        errors++;
      }
    }

    console.log(`Students sync done — synced: ${synced}, errors: ${errors}`);
    return { synced, errors };
  } catch (err) {
    console.error('syncStudents error:', err.message);
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────
// SYNC ALUMNI
// Exact column indexes from your sheet:
// [0]  Timestamp          [1]  Name             [2]  Email
// [3]  Contact Number     [4]  Gender            [5]  Enrollment No
// [6]  Degree Type        [7]  School            [8]  Discipline
// [9]  Course             [10] Year of Passing   [11] Are you currently employed?
// [12] Current Role       [13] Organization / Company Name
// [14] Employment Sector  [15] Employment Type   [16] Salary
// [17] Location           [18] Years of Experience
// [19] Have you pursued...  [20] Please provide details...
// [21] Skill Gap Perceived  [22] Skills Used at Professional / Academic Work
// [23] Would Recommend Goa Jobs  [24] Industry Feedback
// ─────────────────────────────────────────────────────────────────
const syncAlumni = async () => {
  try {
    const spreadsheetId = process.env.ALUMNI_SHEET_ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form Responses 1!A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      console.log('No alumni data in sheet.');
      return { synced: 0, errors: 0 };
    }

    const dataRows = rows.slice(1);
    console.log(`Found ${dataRows.length} alumni rows`);

    let synced = 0, errors = 0;

    for (const row of dataRows) {
      try {
        const getIdx = (idx) => (row[idx] || '').toString().trim();

        const email = getIdx(2);
        if (!email) continue;

        const payload = {
          name:                    getIdx(1),
          email:                   email.toLowerCase(),
          phone:                   getIdx(3),
          gender:                  getIdx(4),
          enrollment_no:           getIdx(5),
          degree_type:             getIdx(6),
          school:                  getIdx(7),
          discipline:              getIdx(8),
          course:                  getIdx(9),
          year_of_passing:         getIdx(10) ? Number(getIdx(10)) : undefined,
          currently_employed:      getIdx(11),
          current_role:            getIdx(12),
          company:                 getIdx(13),
          sector:                  getIdx(14),
          employment_type:         getIdx(15),
          salary:                  cleanSalary(getIdx(16)),
          location:                getIdx(17),
          years_of_experience:     getIdx(18),
          higher_education:        getIdx(19),
          higher_education_detail: getIdx(20),
          skill_gap_perceived:     getIdx(21),
          skills_used:             parseSkills(getIdx(22)),
          would_recommend_goa_jobs: getIdx(23),
          industry_feedback:       getIdx(24),
        };

        // Debug first row
        if (synced === 0 && errors === 0) {
          console.log('\nFirst alumni row mapped:');
          Object.entries(payload).forEach(([k, v]) => console.log(`  ${k}: ${JSON.stringify(v)}`));
        }

        Object.keys(payload).forEach(k => {
          if (payload[k] === undefined || payload[k] === '' ||
             (Array.isArray(payload[k]) && payload[k].length === 0)) {
            delete payload[k];
          }
        });

        await Alumni.findOneAndUpdate(
          { email: payload.email },
          { $set: payload },
          { upsert: true, new: true, runValidators: false }
        );
        synced++;
      } catch (err) {
        console.error('Alumni row error:', err.message);
        errors++;
      }
    }

    console.log(`\nAlumni sync done — synced: ${synced}, errors: ${errors}`);
    return { synced, errors };
  } catch (err) {
    console.error('syncAlumni error:', err.message);
    throw err;
  }
};

module.exports = { syncStudents, syncAlumni };