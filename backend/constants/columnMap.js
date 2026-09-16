// constants/columnMap.js
//
// Defines the predefined target fields for each entity type, and a list of
// likely header aliases for each — used to auto-suggest a column mapping
// when an admin uploads a new Excel file with unknown/inconsistent headers.
//
// To improve auto-match accuracy over time, just add more aliases to these
// arrays (lowercase, no need to worry about spacing/punctuation — that's
// normalized before comparison).
//
// IMPORTANT — handling brand-new columns you didn't predict:
// A column that doesn't match anything here isn't rejected. In the mapping
// step, the admin can mark ANY column as EXTRA_FIELD_MARKER instead of a
// predefined field, and it gets stored under extra_fields on the record —
// keyed by its original header — instead of being dropped. So a future
// sheet with a column you never anticipated still gets saved; you only
// need to add it here (as a real field with a schema) once it becomes
// something the stats team wants treated as a first-class column.

const STUDENT_FIELDS = {
    student_name: ['name', 'student name', 'full name', 'student'],
    email: ['email', 'email address', 'e mail', 'emailid'],
    phone: ['phone', 'contact number', 'mobile', 'contact no', 'phone number'],
    dob: ['dob', 'date of birth', 'birth date'],
    enrollment_no: ['enrollment no', 'enrollment number', 'enrollment', 'roll no'],
    year_of_passing: ['year of passing', 'passing year', 'graduation year'],
    gender: ['gender', 'sex'],
    category: ['category'],
    taluka: ['taluka'],
    district: ['district'],
    degree_type: ['degree', 'degree type'],
    school: ['school'],
    discipline: ['discipline'],
    course: ['course'],
    aspirational_sector: ['aspirational sector', 'sector'],
    entrepreneurship_inclination: ['entrepreneurship inclination', 'entrepreneurship'],
    technical_skills: ['technical skills', 'hard skills', 'skills'],
    soft_skills: ['soft skills'],
    domain_specific: ['domain specific', 'domain specfic'],
  };
  
  const ALUMNI_FIELDS = {
    name: ['name', 'full name', 'student name'],
    email: ['email', 'email address', 'e mail'],
    phone: ['phone', 'contact number', 'mobile', 'contact no', 'phone number'],
    enrollment_no: ['enrollment no', 'enrollment number'],
    current_role: ['current role', 'designation', 'job title'],
    company: ['company', 'organization', 'organisation', 'organization company name', 'organization / company name'],
    location: ['location', 'city'],
    higher_education_detail: ['higher education detail', 'please provide details'],
    industry_feedback: ['industry feedback', 'feedback'],
    year_of_passing: ['year of passing', 'passing year'],
    skills_used: ['skills used', 'skills used at professional academic work', 'skills'],
    currently_employed: ['currently employed', 'are you currently employed'],
    gender: ['gender', 'sex'],
    degree_type: ['degree', 'degree type'],
    school: ['school'],
    discipline: ['discipline'],
    course: ['course'],
    sector: ['sector', 'employment sector'],
    employment_type: ['employment type'],
    salary: ['salary', 'salary range'],
    years_of_experience: ['years of experience', 'experience'],
    higher_education: ['higher education', 'have you pursued higher education'],
    skill_gap_perceived: ['skill gap perceived', 'skill gap'],
    would_recommend_goa_jobs: ['would recommend goa jobs', 'would you recommend'],
  };
  
  // Matches the admission-batch sheet: Admission batch(in years), name,
  // enrolment number, roll number, Programme Code, Programme, OU Name,
  // VALIDITY START, category, gender, PWD applicable.
  const ADMISSION_FIELDS = {
    name: ['name', 'student name', 'full name'],
    enrollment_no: ['enrolment number', 'enrollment number', 'enrolment no', 'enrollment no', 'enrolment'],
    roll_number: ['roll number', 'roll no'],
    admission_batch: ['admission batch', 'admission batch in years', 'batch'],
    programme_code: ['programme code', 'program code'],
    programme: ['programme', 'program'],
    ou_name: ['ou name', 'organizational unit name', 'ou'],
    validity_start: ['validity start', 'validity start date', 'validity'],
    category: ['category'],
    gender: ['gender', 'sex'],
    pwd_applicable: ['pwd applicable', 'pwd'],
  };
  
  const FIELD_MAP = {
    student: STUDENT_FIELDS,
    alumni: ALUMNI_FIELDS,
    admission: ADMISSION_FIELDS,
  };
  
  // Upload is rejected at confirm-time if these end up unmapped
  const REQUIRED_FIELDS = {
    student: ['student_name', 'email'],
    alumni: ['name', 'email'],
    admission: ['name', 'enrollment_no'],
  };
  
  // These fields are stored as arrays (comma separated in the sheet)
  const ARRAY_FIELDS = {
    student: ['technical_skills', 'soft_skills', 'domain_specific'],
    alumni: ['skills_used'],
    admission: [],
  };
  
  // The field used to identify "is this the same record as before" on
  // re-upload (upsert key). student/alumni use email; admission has no
  // email column, so enrollment_no is the natural unique identifier there.
  const UNIQUE_KEY_FIELDS = {
    student: 'email',
    alumni: 'email',
    admission: 'enrollment_no',
  };
  
  // Special mapping value the frontend sends for a column the admin wants
  // to keep, but that doesn't correspond to any predefined field — gets
  // stored under the record's extra_fields instead of being dropped.
  const EXTRA_FIELD_MARKER = '__extra__';
  
  module.exports = {
    FIELD_MAP,
    REQUIRED_FIELDS,
    ARRAY_FIELDS,
    UNIQUE_KEY_FIELDS,
    EXTRA_FIELD_MARKER,
  };