// ============================================================
// EduResult Pro - Simple Working Version
// ============================================================

// ============================================================
// DATA STORE
// ============================================================
const DB = {
  get: function(key) {
    var data = localStorage.getItem('erp_' + key);
    return data ? JSON.parse(data) : null;
  },
  set: function(key, val) {
    localStorage.setItem('erp_' + key, JSON.stringify(val));
  }
};

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
  // Only set default users if none exist
  if (!DB.get('users')) {
    DB.set('users', [
      { id: 'u1', name: 'Administrator', username: 'folusho', password: 'victory2024', role: 'admin' }
    ]);
  }

  // Only set default settings if none exist
  if (!DB.get('settings')) {
    DB.set('settings', {
      schoolName: 'Folusho Victory Schools',
      session: '2024/2025',
      term: 'First Term'
    });
  }

  // Only set grade scale if none exists
  if (!DB.get('gradeScale')) {
    DB.set('gradeScale', [
      { grade: 'A', min: 70, max: 100, remark: 'Excellent' },
      { grade: 'B', min: 60, max: 69, remark: 'Good' },
      { grade: 'C', min: 50, max: 59, remark: 'Pass' },
      { grade: 'F', min: 0, max: 49, remark: 'Fail' }
    ]);
  }

  // Only initialize if no data exists
  if (!DB.get('classes') || DB.get('classes').length === 0) {
    DB.set('classes', []);
    DB.set('students', []);
    DB.set('subjects', []);
    DB.set('scores', []);

    // Create default classes with subjects
    var defaultClasses = [
      { name: 'Nursery 1', level: 'nursery' },
      { name: 'Nursery 2', level: 'nursery' },
      { name: 'Primary 1', level: 'primary' },
      { name: 'Primary 2', level: 'primary' },
      { name: 'Primary 3', level: 'primary' },
      { name: 'Primary 4', level: 'primary' },
      { name: 'Primary 5', level: 'primary' },
      { name: 'Primary 6', level: 'primary' },
      { name: 'JSS 1', level: 'secondary' },
      { name: 'JSS 2', level: 'secondary' },
      { name: 'JSS 3', level: 'secondary' },
      { name: 'SSS 1 Science', level: 'secondary' },
      { name: 'SSS 2 Science', level: 'secondary' },
      { name: 'SSS 3 Science', level: 'secondary' }
    ];

    defaultClasses.forEach(function(cls) {
      addClassWithSubjects(cls.name, cls.level);
    });
  }
}

// Initialize on load
init();

// Get subjects for a class
function getSubjectsForClass(classId) {
  var subjects = DB.get('subjects') || [];
  return subjects.filter(function(s) { return s.classId === classId; });
}

// Add class with auto-subjects
function addClassWithSubjects(name, level) {
  var classes = DB.get('classes') || [];
  var classId = 'c' + Date.now();
  
  classes.push({
    id: classId,
    name: name,
    level: level
  });
  DB.set('classes', classes);
  
  // Auto-add subjects based on level
  var newSubjects = [];
  var existingSubjects = DB.get('subjects') || [];
  
  if (level === 'nursery') {
    newSubjects = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English Language', code: 'ENG' },
      { name: 'Basic Science', code: 'SCI' },
      { name: 'Social Studies', code: 'SOS' },
      { name: 'Religious Studies', code: 'CRS' },
      { name: 'Health Education', code: 'HE' },
      { name: 'Phonics', code: 'PH' }
    ];
  } else if (level === 'primary') {
    newSubjects = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English Language', code: 'ENG' },
      { name: 'Basic Science', code: 'SCI' },
      { name: 'Social Studies', code: 'SOS' },
      { name: 'Religious Studies', code: 'CRS' },
      { name: 'Health Education', code: 'HE' },
      { name: 'Computer Studies', code: 'ICT' },
      { name: 'Quantitative Reasoning', code: 'QR' },
      { name: 'Verbal Reasoning', code: 'VR' },
      { name: 'Civic Education', code: 'CVC' },
      { name: 'Agricultural Science', code: 'AGR' },
      { name: 'Fine Arts', code: 'FA' }
    ];
  } else if (level === 'secondary') {
    newSubjects = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English Language', code: 'ENG' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
      { name: 'Geography', code: 'GEO' },
      { name: 'History', code: 'HIST' },
      { name: 'Civic Education', code: 'CIV' },
      { name: 'Religious Studies', code: 'CRS' },
      { name: 'Agricultural Science', code: 'AGR' },
      { name: 'Business Studies', code: 'BST' },
      { name: 'Computer Studies', code: 'ICT' },
      { name: 'Home Economics', code: 'HEX' },
      { name: 'Technical Drawing', code: 'TD' },
      { name: 'Fine Arts', code: 'FA' },
      { name: 'Music', code: 'MUS' },
      { name: 'French', code: 'FRE' }
    ];
  }
  
  // Add new subjects with classId
  newSubjects.forEach(function(sub, idx) {
    existingSubjects.push({
      id: classId + 's' + idx,
      name: sub.name,
      code: sub.code,
      classId: classId
    });
  });
  
  DB.set('subjects', existingSubjects);
  return classId;
}

// Add Nigerian School Subjects
function addNigerianSubjects() {
  var classes = DB.get('classes') || [];
  
  // Create classes if none exist
  if (classes.length === 0) {
    // Nursery Classes
    DB.set('classes', [
      { id: 'c1', name: 'Nursery 1', level: 'nursery' },
      { id: 'c2', name: 'Nursery 2', level: 'nursery' },
      { id: 'c3', name: 'Primary 1', level: 'primary' },
      { id: 'c4', name: 'Primary 2', level: 'primary' },
      { id: 'c5', name: 'Primary 3', level: 'primary' },
      { id: 'c6', name: 'Primary 4', level: 'primary' },
      { id: 'c7', name: 'Primary 5', level: 'primary' },
      { id: 'c8', name: 'Primary 6', level: 'primary' },
      { id: 'c9', name: 'JSS 1', level: 'secondary' },
      { id: 'c10', name: 'JSS 2', level: 'secondary' },
      { id: 'c11', name: 'JSS 3', level: 'secondary' },
      { id: 'c12', name: 'SSS 1', level: 'secondary' },
      { id: 'c13', name: 'SSS 2', level: 'secondary' },
      { id: 'c14', name: 'SSS 3', level: 'secondary' }
    ]);
  }
  
  var classList = DB.get('classes');
  
  // Get class IDs by name
  var nur1 = classList.find(function(c) { return c.name === 'Nursery 1'; });
  var nur2 = classList.find(function(c) { return c.name === 'Nursery 2'; });
  var pri1 = classList.find(function(c) { return c.name === 'Primary 1'; });
  var pri2 = classList.find(function(c) { return c.name === 'Primary 2'; });
  var pri3 = classList.find(function(c) { return c.name === 'Primary 3'; });
  var pri4 = classList.find(function(c) { return c.name === 'Primary 4'; });
  var pri5 = classList.find(function(c) { return c.name === 'Primary 5'; });
  var pri6 = classList.find(function(c) { return c.name === 'Primary 6'; });
  var jss1 = classList.find(function(c) { return c.name === 'JSS 1'; });
  var jss2 = classList.find(function(c) { return c.name === 'JSS 2'; });
  var jss3 = classList.find(function(c) { return c.name === 'JSS 3'; });
  var sss1 = classList.find(function(c) { return c.name === 'SSS 1'; });
  var sss2 = classList.find(function(c) { return c.name === 'SSS 2'; });
  var sss3 = classList.find(function(c) { return c.name === 'SSS 3'; });
  
  // Check if subjects exist
  if (DB.get('subjects') && DB.get('subjects').length > 0) return;
  
  var subjects = [];
  
  // Nursery Subjects
  if (nur1) subjects.push(
    { id: 's1', name: 'Mathematics', code: 'MATH', classId: nur1.id },
    { id: 's2', name: 'English Language', code: 'ENG', classId: nur1.id },
    { id: 's3', name: 'Basic Science', code: 'SCI', classId: nur1.id },
    { id: 's4', name: 'Social Studies', code: 'SOS', classId: nur1.id },
    { id: 's5', name: 'Religious Studies', code: 'CRS', classId: nur1.id },
    { id: 's6', name: 'Health Education', code: 'HE', classId: nur1.id },
    { id: 's7', name: 'Vocational Aptitude', code: 'VA', classId: nur1.id },
    { id: 's8', name: 'Phonics', code: 'PH', classId: nur1.id }
  );
  
  if (nur2) subjects.push(
    { id: 's9', name: 'Mathematics', code: 'MATH', classId: nur2.id },
    { id: 's10', name: 'English Language', code: 'ENG', classId: nur2.id },
    { id: 's11', name: 'Basic Science', code: 'SCI', classId: nur2.id },
    { id: 's12', name: 'Social Studies', code: 'SOS', classId: nur2.id },
    { id: 's13', name: 'Religious Studies', code: 'CRS', classId: nur2.id },
    { id: 's14', name: 'Health Education', code: 'HE', classId: nur2.id },
    { id: 's15', name: 'Quantitative Reasoning', code: 'QR', classId: nur2.id },
    { id: 's16', name: 'Verbal Reasoning', code: 'VR', classId: nur2.id }
  );
  
  // Primary 1-3 Subjects
  [pri1, pri2, pri3].forEach(function(p, idx) {
    if (p) subjects.push(
      { id: 'p' + idx + '1', name: 'Mathematics', code: 'MATH', classId: p.id },
      { id: 'p' + idx + '2', name: 'English Language', code: 'ENG', classId: p.id },
      { id: 'p' + idx + '3', name: 'Basic Science', code: 'SCI', classId: p.id },
      { id: 'p' + idx + '4', name: 'Social Studies', code: 'SOS', classId: p.id },
      { id: 'p' + idx + '5', name: 'Religious Studies', code: 'CRS', classId: p.id },
      { id: 'p' + idx + '6', name: 'Health Education', code: 'HE', classId: p.id },
      { id: 'p' + idx + '7', name: 'Computer Studies', code: 'ICT', classId: p.id },
      { id: 'p' + idx + '8', name: 'Quantitative Reasoning', code: 'QR', classId: p.id },
      { id: 'p' + idx + '9', name: 'Verbal Reasoning', code: 'VR', classId: p.id },
      { id: 'p' + idx + '10', name: 'Civic Education', code: 'CVC', classId: p.id },
      { id: 'p' + idx + '11', name: 'Agricultural Science', code: 'AGR', classId: p.id },
      { id: 'p' + idx + '12', name: 'Fine Arts', code: 'FA', classId: p.id }
    );
  });
  
  // Primary 4-6 Subjects
  [pri4, pri5, pri6].forEach(function(p, idx) {
    if (p) subjects.push(
      { id: 'p' + (idx+4) + '1', name: 'Mathematics', code: 'MATH', classId: p.id },
      { id: 'p' + (idx+4) + '2', name: 'English Language', code: 'ENG', classId: p.id },
      { id: 'p' + (idx+4) + '3', name: 'Basic Science', code: 'SCI', classId: p.id },
      { id: 'p' + (idx+4) + '4', name: 'Social Studies', code: 'SOS', classId: p.id },
      { id: 'p' + (idx+4) + '5', name: 'Religious Studies', code: 'CRS', classId: p.id },
      { id: 'p' + (idx+4) + '6', name: 'Health Education', code: 'HE', classId: p.id },
      { id: 'p' + (idx+4) + '7', name: 'Computer Studies', code: 'ICT', classId: p.id },
      { id: 'p' + (idx+4) + '8', name: 'Quantitative Reasoning', code: 'QR', classId: p.id },
      { id: 'p' + (idx+4) + '9', name: 'Verbal Reasoning', code: 'VR', classId: p.id },
      { id: 'p' + (idx+4) + '10', name: 'Civic Education', code: 'CVC', classId: p.id },
      { id: 'p' + (idx+4) + '11', name: 'Agricultural Science', code: 'AGR', classId: p.id },
      { id: 'p' + (idx+4) + '12', name: 'Fine Arts', code: 'FA', classId: p.id },
      { id: 'p' + (idx+4) + '13', name: 'Business Studies', code: 'BST', classId: p.id },
      { id: 'p' + (idx+4) + '14', name: 'Home Economics', code: 'HEX', classId: p.id },
      { id: 'p' + (idx+4) + '15', name: 'Literature', code: 'LIT', classId: p.id }
    );
  });
  
  // JSS Subjects (Junior Secondary)
  [jss1, jss2, jss3].forEach(function(j, idx) {
    if (j) subjects.push(
      { id: 'j' + idx + '1', name: 'Mathematics', code: 'MATH', classId: j.id },
      { id: 'j' + idx + '2', name: 'English Language', code: 'ENG', classId: j.id },
      { id: 'j' + idx + '3', name: 'Physics', code: 'PHY', classId: j.id },
      { id: 'j' + idx + '4', name: 'Chemistry', code: 'CHEM', classId: j.id },
      { id: 'j' + idx + '5', name: 'Biology', code: 'BIO', classId: j.id },
      { id: 'j' + idx + '6', name: 'Geography', code: 'GEO', classId: j.id },
      { id: 'j' + idx + '7', name: 'History', code: 'HIST', classId: j.id },
      { id: 'j' + idx + '8', name: 'Civic Education', code: 'CIV', classId: j.id },
      { id: 'j' + idx + '9', name: 'Religious Studies (CRK/IRS)', code: 'RS', classId: j.id },
      { id: 'j' + idx + '10', name: 'Agricultural Science', code: 'AGR', classId: j.id },
      { id: 'j' + idx + '11', name: 'Business Studies', code: 'BST', classId: j.id },
      { id: 'j' + idx + '12', name: 'Computer Studies', code: 'ICT', classId: j.id },
      { id: 'j' + idx + '13', name: 'Home Economics', code: 'HEX', classId: j.id },
      { id: 'j' + idx + '14', name: 'Technical Drawing', code: 'TD', classId: j.id },
      { id: 'j' + idx + '15', name: 'Fine Arts', code: 'FA', classId: j.id },
      { id: 'j' + idx + '16', name: 'Music', code: 'MUS', classId: j.id },
      { id: 'j' + idx + '17', name: 'French', code: 'FRE', classId: j.id },
      { id: 'j' + idx + '18', name: 'Igbo/Yoruba', code: 'LAN', classId: j.id },
      { id: 'j' + idx + '19', name: 'Physical Education', code: 'PE', classId: j.id }
    );
  });
  
  // SSS (Senior Secondary)
  // Science Class
  if (sss1) subjects.push(
    { id: 'ss1', name: 'Mathematics', code: 'MATH', classId: sss1.id },
    { id: 'ss2', name: 'English Language', code: 'ENG', classId: sss1.id },
    { id: 'ss3', name: 'Physics', code: 'PHY', classId: sss1.id },
    { id: 'ss4', name: 'Chemistry', code: 'CHEM', classId: sss1.id },
    { id: 'ss5', name: 'Biology', code: 'BIO', classId: sss1.id },
    { id: 'ss6', name: 'Geography', code: 'GEO', classId: sss1.id },
    { id: 'ss7', name: 'Further Mathematics', code: 'FM', classId: sss1.id },
    { id: 'ss8', name: 'Computer Studies', code: 'ICT', classId: sss1.id },
    { id: 'ss9', name: 'Civic Education', code: 'CIV', classId: sss1.id },
    { id: 'ss10', name: 'Religious Studies', code: 'RS', classId: sss1.id }
  );
  
  // Commercial Class
  if (sss2) subjects.push(
    { id: 'sc1', name: 'Mathematics', code: 'MATH', classId: sss2.id },
    { id: 'sc2', name: 'English Language', code: 'ENG', classId: sss2.id },
    { id: 'sc3', name: 'Physics', code: 'PHY', classId: sss2.id },
    { id: 'sc4', name: 'Chemistry', code: 'CHEM', classId: sss2.id },
    { id: 'sc5', name: 'Biology', code: 'BIO', classId: sss2.id },
    { id: 'sc6', name: 'Geography', code: 'GEO', classId: sss2.id },
    { id: 'sc7', name: 'Commerce', code: 'COM', classId: sss2.id },
    { id: 'sc8', name: 'Accounting', code: 'ACC', classId: sss2.id },
    { id: 'sc9', name: 'Economics', code: 'Econ', classId: sss2.id },
    { id: 'sc10', name: 'Business Studies', code: 'BST', classId: sss2.id }
  );
  
  // Arts Class
  if (sss3) subjects.push(
    { id: 'sa1', name: 'Mathematics', code: 'MATH', classId: sss3.id },
    { id: 'sa2', name: 'English Language', code: 'ENG', classId: sss3.id },
    { id: 'sa3', name: 'Literature-in-English', code: 'LIT', classId: sss3.id },
    { id: 'sa4', name: 'History', code: 'HIST', classId: sss3.id },
    { id: 'sa5', name: 'Geography', code: 'GEO', classId: sss3.id },
    { id: 'sa6', name: 'Government', code: 'GOV', classId: sss3.id },
    { id: 'sa7', name: 'CRS/IRS', code: 'RS', classId: sss3.id },
    { id: 'sa8', name: 'Economics', code: 'ECON', classId: sss3.id },
    { id: 'sa9', name: 'Commerce', code: 'COM', classId: sss3.id },
    { id: 'sa10', name: 'Accounting', code: 'ACC', classId: sss3.id }
  );
  
  DB.set('subjects', subjects);
}

// Add the Nigerian subjects
addNigerianSubjects();

// ============================================================
// ============================================================
// LOGIN - ADMIN
// ============================================================
function doAdminLogin() {
  var username = document.getElementById('adminUsername').value.trim();
  var password = document.getElementById('adminPassword').value.trim();
  
  if (!username || !password) {
    alert('Please enter username and password');
    return;
  }
  
  var users = DB.get('users');
  var user = null;
  
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password && users[i].role === 'admin') {
      user = users[i];
      break;
    }
  }
  
  if (!user) {
    alert('Invalid admin username or password');
    return;
  }
  
  currentUser = user;
  
  // Success - show main app
  document.getElementById('loginPage').style.display = 'none';
  var mainApp = document.getElementById('mainApp');
  mainApp.style.display = 'flex';
  mainApp.classList.add('active');
  
  document.getElementById('topbarUser').textContent = user.name;
  
  // Show admin panel
  document.getElementById('adminUserPanel').style.display = 'block';
  document.getElementById('teacherUserPanel').style.display = 'none';
  loadUsersTable();
  updateUsersClassSelect();
  updateStudentClassSelect();
  updateScoreClassSelect();
  updateRCClassSelect();
  updateComputeClassSelect();
  updateViewClassSelect();
  
  loadDashboard();
}

// ============================================================
// LOGIN - TEACHER
// ============================================================
function doTeacherLogin() {
  var username = document.getElementById('teacherUsername').value.trim();
  var password = document.getElementById('teacherPassword').value.trim();
  
  if (!username || !password) {
    alert('Please enter username and password');
    return;
  }
  
  var users = DB.get('users');
  var user = null;
  
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password && users[i].role === 'teacher') {
      user = users[i];
      break;
    }
  }
  
  if (!user) {
    alert('Invalid teacher username or password');
    return;
  }
  
  currentUser = user;
  
  // Success - show main app
  document.getElementById('loginPage').style.display = 'none';
  var mainApp = document.getElementById('mainApp');
  mainApp.style.display = 'flex';
  mainApp.classList.add('active');
  
  document.getElementById('topbarUser').textContent = user.name;
  
  // Show teacher panel
  document.getElementById('adminUserPanel').style.display = 'none';
  document.getElementById('teacherUserPanel').style.display = 'block';
  updateStudentClassSelect();
  updateScoreClassSelect();
  updateRCClassSelect();
  updateComputeClassSelect();
  updateViewClassSelect();
  
  // Show teacher assigned class
  var classes = DB.get('classes') || [];
  var cls = classes.find(function(c) { return c.id === user.classId; });
  document.getElementById('teacherClassName').textContent = cls ? cls.name : 'Not Assigned';
  
  loadDashboard();
}

// ============================================================
// PASSWORD TOGGLE
// ============================================================
function toggleAdminPass() {
  var inp = document.getElementById('adminPassword');
  var icon = document.getElementById('adminEyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function toggleTeacherPass() {
  var inp = document.getElementById('teacherPassword');
  var icon = document.getElementById('teacherEyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    var mainApp = document.getElementById('mainApp');
    mainApp.style.display = 'none';
    mainApp.classList.remove('active');
    document.getElementById('loginPage').style.display = 'flex';
    
    // Reset both forms
    document.getElementById('adminLoginForm').reset();
    document.getElementById('teacherLoginForm').reset();
    
    // Reset eye icons
    document.getElementById('adminEyeIcon').className = 'fas fa-eye';
    document.getElementById('teacherEyeIcon').className = 'fas fa-eye';
    
    currentUser = null;
  }
}

// ============================================================
// NAVIGATION
// ============================================================
function goTo(section) {
  // Teacher access restriction
  if (currentUser && currentUser.role === 'teacher') {
    var allowedSections = ['dashboard', 'students', 'subjects', 'enter-scores', 'report-card', 'users'];
    if (allowedSections.indexOf(section) === -1) {
      alert('You do not have access to this section. Contact admin for help.');
      return;
    }
  }
  
  // Hide all sections
  var sections = document.querySelectorAll('.section');
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove('active');
  }
  
  // Remove active from nav links
  var links = document.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('active');
  }
  
  // Show selected section
  var target = document.getElementById('sec-' + section);
  if (target) {
    target.classList.add('active');
  }
  
  // Set nav link active
  var navLinks = document.querySelectorAll('.nav-link');
  for (var i = 0; i < navLinks.length; i++) {
    if (navLinks[i].getAttribute('data-section') === section) {
      navLinks[i].classList.add('active');
      break;
    }
  }
  
  // Update title
  var titles = {
    'dashboard': 'Dashboard',
    'school-settings': 'School Settings',
    'classes': 'Classes',
    'students': 'Students',
    'subjects': 'Subjects',
    'enter-scores': 'Enter Scores',
    'compute-results': 'Compute Results',
    'view-results': 'View Results',
    'report-card': 'Report Card',
    'users': 'Users'
  };
  document.getElementById('topbarTitle').textContent = titles[section] || section;
  
  // Refresh content
  loadDashboard();
  
  // Section-specific refresh
  if (section === 'students') {
    loadStudentsTable();
    updateStudentClassSelect();
  }
  if (section === 'classes') {
    loadClassesProfiles();
  }
  if (section === 'subjects') {
    loadSubjectsCatalog();
  }
  if (section === 'school-settings') {
    var settings = DB.get('settings') || {};
    document.getElementById('ss-name').value = settings.schoolName || '';
    document.getElementById('ss-session').value = settings.session || '';
    document.getElementById('ss-term').value = settings.term || 'First Term';
  }
  if (section === 'enter-scores') {
    updateScoreClassSelect();
  }
  if (section === 'compute-results') {
    updateComputeClassSelect();
  }
  if (section === 'view-results') {
    updateViewClassSelect();
  }
  if (section === 'report-card') {
    updateRCClassSelect();
  }
  if (section === 'users' && currentUser && currentUser.role === 'admin') {
    loadUsersTable();
    updateUsersClassSelect();
  }
  
  // Close sidebar on mobile after navigation
  closeSidebarOnMobile();
}

// ============================================================
// NAVIGATION CAROUSEL SCROLL HANDLER
// ============================================================
function scrollNavCarousel(distance) {
  var navCarousel = document.getElementById('sidebar-nav');
  if (navCarousel) {
    navCarousel.scrollBy({
      top: distance,
      behavior: 'smooth'
    });
  }
}

// ============================================================
// CAROUSEL SCROLL HANDLER
// ============================================================
function scrollCarousel(carouselId, distance) {
  var carousel = document.getElementById(carouselId);
  if (carousel) {
    carousel.scrollBy({
      top: distance,
      behavior: 'smooth'
    });
  }
}

// ============================================================
// DASHBOARD
// ============================================================
function loadDashboard() {
  var students = DB.get('students') || [];
  var classes = DB.get('classes') || [];
  var subjects = DB.get('subjects') || [];
  var results = DB.get('results') || [];
  
  document.getElementById('dashboardStats').innerHTML = 
    '<div class="stat-card">' +
      '<div class="stat-icon blue"><i class="fas fa-users"></i></div>' +
      '<div class="stat-info"><h4>Total Students</h4><p>' + students.length + '</p></div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-icon green"><i class="fas fa-chalkboard"></i></div>' +
      '<div class="stat-info"><h4>Classes</h4><p>' + classes.length + '</p></div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-icon blue"><i class="fas fa-book"></i></div>' +
      '<div class="stat-info"><h4>Subjects</h4><p>' + subjects.length + '</p></div>' +
    '</div>';
}

// ============================================================
// CREATE CLASS WITH AUTO-SUBJECTS
// ============================================================
function createClass() {
  var name = document.getElementById('className').value.trim();
  var level = document.getElementById('classLevel').value;
  
  if (!name) {
    alert('Please enter class name');
    return;
  }
  
  // Check if class exists
  var classes = DB.get('classes') || [];
  if (classes.find(function(c) { return c.name === name; })) {
    alert('Class already exists!');
    return;
  }
  
  // Create class with auto-subjects
  var newClassId = addClassWithSubjects(name, level);

  alert('Class created with ' + getSubjectsForClass(newClassId).length + ' subjects!');
  document.getElementById('className').value = '';
  
  // Refresh classes display
  loadClassesProfiles();
}

// ============================================================
// LOAD CLASSES PROFILES
// ============================================================
function loadClassesProfiles() {
  var classes = DB.get('classes') || [];
  var students = DB.get('students') || [];
  var subjects = DB.get('subjects') || [];
  var area = document.getElementById('classesProfilesArea');
  
  if (classes.length === 0) {
    area.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-muted);">No classes created yet.</p></div>';
    return;
  }
  
  var html = '';
  
  // Group classes by level
  var nurseryClasses = classes.filter(function(c) { return c.level === 'nursery'; });
  var primaryClasses = classes.filter(function(c) { return c.level === 'primary'; });
  var secondaryClasses = classes.filter(function(c) { return c.level === 'secondary'; });
  
  function renderClassGroup(groupClasses, levelName) {
    if (groupClasses.length === 0) return '';
    var groupHtml = '<h3 style="margin:20px 0 15px;color:var(--text);">' + levelName + '</h3>';
    
    groupClasses.forEach(function(cls) {
      var classSubjects = subjects.filter(function(s) { return s.classId === cls.id; });
      var classStudents = students.filter(function(s) { return s.classId === cls.id; });
      
      var levelBadge = '';
      if (cls.level === 'nursery') levelBadge = '<span style="background:#dbeafe;color:#2563eb;padding:3px 10px;border-radius:6px;font-size:12px;">Nursery</span>';
      else if (cls.level === 'primary') levelBadge = '<span style="background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:6px;font-size:12px;">Primary</span>';
      else levelBadge = '<span style="background:#fef3c7;color:#d97706;padding:3px 10px;border-radius:6px;font-size:12px;">Secondary</span>';
      
      var subList = classSubjects.map(function(s) {
        return '<span style="display:inline-block;background:var(--primary-light);color:var(--primary);padding:4px 10px;border-radius:6px;margin:3px;font-size:13px;">' + s.code + '</span>';
      }).join('');
      
      groupHtml += 
        '<div class="card" style="margin-bottom:15px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
            '<div style="display:flex;align-items:center;gap:12px;">' +
              '<h3 style="margin:0;font-size:1.1rem;">' + cls.name + '</h3>' +
              levelBadge +
            '</div>' +
            '<span style="color:var(--text-muted);font-size:14px;">' + classStudents.length + ' Students | ' + classSubjects.length + ' Subjects</span>' +
          '</div>' +
          '<div style="margin-top:10px;">' +
            '<p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;font-weight:600;">Subjects:</p>' +
            '<div style="display:flex;flex-wrap:wrap;gap:5px;">' + (subList || '<span style="color:var(--text-muted);">No subjects</span>') + '</div>' +
          '</div>' +
        '</div>';
    });
    
    return groupHtml;
  }
  
  html += renderClassGroup(nurseryClasses, 'Nursery School');
  html += renderClassGroup(primaryClasses, 'Primary School');
  html += renderClassGroup(secondaryClasses, 'Secondary School');
  
  area.innerHTML = html;
}

// Load classes when going to classes section
var originalGoTo = goTo;
goTo = function(section) {
  originalGoTo(section);
  if (section === 'classes') {
    loadClassesProfiles();
  }
  if (section === 'subjects') {
    loadSubjectsCatalog();
  }
};

// Load subjects catalog
function loadSubjectsCatalog() {
  var subjects = DB.get('subjects') || [];
  var classes = DB.get('classes') || [];
  var area = document.getElementById('subjectsCatalogArea');
  
  if (subjects.length === 0) {
    area.innerHTML = '<div class="card"><p style="text-align:center;color:var(--text-muted);">No subjects found.</p></div>';
    return;
  }
  
  // Group by class
  var html = '';
  
  classes.forEach(function(cls) {
    var classSubjects = subjects.filter(function(s) { return s.classId === cls.id; });
    if (classSubjects.length === 0) return;
    
    var levelBadge = '';
    if (cls.level === 'nursery') levelBadge = '<span style="background:#dbeafe;color:#2563eb;padding:3px 10px;border-radius:6px;font-size:12px;">Nursery</span>';
    else if (cls.level === 'primary') levelBadge = '<span style="background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:6px;font-size:12px;">Primary</span>';
    else levelBadge = '<span style="background:#fef3c7;color:#d97706;padding:3px 10px;border-radius:6px;font-size:12px;">Secondary</span>';
    
    var subItems = classSubjects.map(function(s) {
      return '<span style="display:inline-block;background:var(--primary-light);color:var(--primary);padding:6px 12px;border-radius:8px;margin:4px;font-size:14px;font-weight:600;">' + s.code + '</span>';
    }).join('');
    
    html += 
      '<div class="card" style="margin-bottom:15px;">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
          '<h3 style="margin:0;font-size:1.05rem;">' + cls.name + '</h3>' +
          levelBadge +
          '<span style="color:var(--text-muted);margin-left:auto;font-size:14px;">' + classSubjects.length + ' subjects</span>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:5px;">' + subItems + '</div>' +
      '</div>';
  });
  
  area.innerHTML = html;
}

// ============================================================
// SIDENAV TOGGLE
// ============================================================
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// ============================================================
// CLOSE SIDEBAR ON MOBILE AFTER NAV CLICK
// ============================================================
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
  }
}

// ============================================================
// SCHOOL SETTINGS
// ============================================================
function saveSettings() {
  var name = document.getElementById('ss-name').value.trim();
  var session = document.getElementById('ss-session').value.trim();
  var term = document.getElementById('ss-term').value;
  
  if (!name || !session) {
    alert('Please enter school name and session');
    return;
  }
  
  DB.set('settings', {
    schoolName: name,
    session: session,
    term: term
  });
  
  alert('Settings saved successfully!');
}

function resetAllData() {
  if (!confirm('Are you sure you want to reset ALL data? This will delete all students, scores, and classes. This cannot be undone!')) {
    return;
  }
  
  var keys = ['students', 'scores', 'classes', 'subjects', 'results'];
  keys.forEach(function(key) {
    localStorage.removeItem('erp_' + key);
  });
  
  alert('All data has been reset. Please refresh the page.');
  location.reload();
}

// ============================================================
// USER MANAGEMENT
// ============================================================
var currentUser = null;

function createUser() {
  var name = document.getElementById('newUser-name').value.trim();
  var username = document.getElementById('newUser-username').value.trim();
  var password = document.getElementById('newUser-password').value;
  var classId = document.getElementById('newUser-class').value;
  var role = document.getElementById('newUser-role').value;
  
  if (!name || !username || !password) {
    alert('Please fill all fields');
    return;
  }
  
  if (role === 'teacher' && !classId) {
    alert('Please assign a class to the teacher');
    return;
  }
  
  var users = DB.get('users') || [];
  
  if (users.find(function(u) { return u.username === username; })) {
    alert('Username already exists');
    return;
  }
  
  users.push({
    id: 'u' + Date.now(),
    name: name,
    username: username,
    password: password,
    role: role,
    classId: classId || null
  });
  
  DB.set('users', users);
  
  alert('User created successfully!');
  document.getElementById('newUser-name').value = '';
  document.getElementById('newUser-username').value = '';
  document.getElementById('newUser-password').value = '';
  document.getElementById('newUser-class').value = '';
  
  loadUsersTable();
}

function loadUsersTable() {
  var users = DB.get('users') || [];
  var classes = DB.get('classes') || [];
  var tbody = document.getElementById('usersTableBody');
  
  var html = '';
  users.forEach(function(u, idx) {
    if (u.role === 'admin') return; // Skip admin
    
    var cls = classes.find(function(c) { return c.id === u.classId; });
    var className = cls ? cls.name : '-';
    var roleBadge = '';
    if (u.role === 'teacher') roleBadge = '<span style="background:#dbeafe;color:#2563eb;padding:2px 8px;border-radius:4px;font-size:12px;">Teacher</span>';
    else roleBadge = '<span style="background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:4px;font-size:12px;">' + u.role + '</span>';
    
    html += '<tr>' +
      '<td>' + (idx+1) + '</td>' +
      '<td><strong>' + u.name + '</strong></td>' +
      '<td>' + u.username + '</td>' +
      '<td>' + className + '</td>' +
      '<td>' + roleBadge + '</td>' +
      '<td><button class="btn btn-primary" style="padding:6px 12px;background:var(--danger);" onclick="deleteUser(\'' + u.id + '\')"><i class="fas fa-trash"></i></button></td>' +
    '</tr>';
  });
  
  tbody.innerHTML = html || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No users found</td></tr>';
}

function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  var users = DB.get('users') || [];
  users = users.filter(function(u) { return u.id !== userId; });
  DB.set('users', users);
  loadUsersTable();
  alert('User deleted!');
}

function updateUsersClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('newUser-class');
  var html = '<option value="">-- Select Class --</option>';
  classes.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

// ============================================================
// STUDENTS MANAGEMENT
// ============================================================
function addStudent() {
  var surname = document.getElementById('std-surname').value.trim();
  var firstname = document.getElementById('std-firstname').value.trim();
  var classId = document.getElementById('std-class').value;
  var gender = document.getElementById('std-gender').value;
  
  if (!surname || !firstname || !classId) {
    alert('Please enter student name and select class');
    return;
  }
  
  var name = surname + ' ' + firstname;
  var students = DB.get('students') || [];
  
  var admNo = 'A' + Date.now();
  
  students.push({
    id: 'st' + Date.now(),
    name: name,
    classId: classId,
    admissionNo: admNo,
    gender: gender
  });
  
  DB.set('students', students);
  
  alert('Student added successfully!');
  document.getElementById('std-surname').value = '';
  document.getElementById('std-firstname').value = '';
  loadStudentsTable();
}

function loadStudentsTable() {
  var students = DB.get('students') || [];
  var classes = DB.get('classes') || [];
  var tbody = document.getElementById('studentsTableBody');
  
  var filtered = students;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filtered = students.filter(function(s) { return s.classId === currentUser.classId; });
  }
  
  var html = '';
  filtered.forEach(function(s, idx) {
    var cls = classes.find(function(c) { return c.id === s.classId; });
    var className = cls ? cls.name : '-';
    
    html += '<tr>' +
      '<td>' + (idx+1) + '</td>' +
      '<td><strong>' + s.name + '</strong></td>' +
      '<td>' + className + '</td>' +
      '<td>' + (s.gender || '-') + '</td>' +
      '<td><button class="btn btn-primary" style="padding:6px 12px;background:var(--danger);" onclick="deleteStudent(\'' + s.id + '\')"><i class="fas fa-trash"></i></button></td>' +
    '</tr>';
  });
  
  tbody.innerHTML = html || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No students found</td></tr>';
}

function deleteStudent(studentId) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  
  var students = DB.get('students') || [];
  students = students.filter(function(s) { return s.id !== studentId; });
  DB.set('students', students);
  loadStudentsTable();
  alert('Student deleted!');
}

function updateStudentClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('std-class');
  var html = '<option value="">-- Select Class --</option>';
  
  var filteredClasses = classes;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filteredClasses = classes.filter(function(c) { return c.id === currentUser.classId; });
  }
  
  filteredClasses.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

function updateScoreClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('scoreClass');
  var html = '<option value="">-- Select Class --</option>';
  
  var filteredClasses = classes;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filteredClasses = classes.filter(function(c) { return c.id === currentUser.classId; });
  }
  
  filteredClasses.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

function loadScoreSubjects() {
  var classId = document.getElementById('scoreClass').value;
  var subjectSelect = document.getElementById('scoreSubject');
  
  if (!classId) {
    subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
    return;
  }
  
  var subjects = getSubjectsForClass(classId);
  var html = '<option value="">-- Select Subject --</option>';
  subjects.forEach(function(s) {
    html += '<option value="' + s.id + '">' + s.name + ' (' + s.code + ')</option>';
  });
  subjectSelect.innerHTML = html;
}

function loadScoreSheet() {
  var classId = document.getElementById('scoreClass').value;
  var subjectId = document.getElementById('scoreSubject').value;
  
  if (!classId || !subjectId) {
    document.getElementById('scoreSheet').style.display = 'none';
    return;
  }
  
  var students = DB.get('students') || [];
  var classStudents = students.filter(function(s) { return s.classId === classId; });
  var scores = DB.get('scores') || [];
  
  var tbody = document.getElementById('scoreTableBody');
  var html = '';
  
  classStudents.forEach(function(s) {
    var existingScore = scores.find(function(sc) { 
      return sc.studentId === s.id && sc.subjectId === subjectId; 
    });
    var scoreVal = existingScore ? existingScore.score : '';
    
    html += '<tr>' +
      '<td>' + s.admissionNo + '</td>' +
      '<td>' + s.name + '</td>' +
      '<td><input type="number" min="0" max="100" value="' + scoreVal + '" style="width:80px;padding:8px;border:1px solid var(--border);border-radius:6px;" data-student="' + s.id + '"></td>' +
    '</tr>';
  });
  
  tbody.innerHTML = html || '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);">No students in this class</td></tr>';
  document.getElementById('scoreSheet').style.display = 'block';
}

function saveScores() {
  var subjectId = document.getElementById('scoreSubject').value;
  var inputs = document.querySelectorAll('#scoreTableBody input');
  var scores = DB.get('scores') || [];
  
  inputs.forEach(function(inp) {
    var studentId = inp.getAttribute('data-student');
    var score = parseFloat(inp.value);
    
    if (isNaN(score) || score < 0 || score > 100) {
      return;
    }
    
    var existingIdx = scores.findIndex(function(sc) { 
      return sc.studentId === studentId && sc.subjectId === subjectId; 
    });
    
    if (existingIdx >= 0) {
      scores[existingIdx].score = score;
    } else {
      scores.push({
        id: 'sc' + Date.now() + Math.random(),
        studentId: studentId,
        subjectId: subjectId,
        score: score
      });
    }
  });
  
  DB.set('scores', scores);
  alert('Scores saved successfully!');
}

function updateRCClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('rcClass');
  var html = '<option value="">-- Select Class --</option>';
  
  var filteredClasses = classes;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filteredClasses = classes.filter(function(c) { return c.id === currentUser.classId; });
  }
  
  filteredClasses.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

function loadRCStudents() {
  var classId = document.getElementById('rcClass').value;
  var studentSelect = document.getElementById('rcStudent');
  
  if (!classId) {
    studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
    return;
  }
  
  var students = DB.get('students') || [];
  var classStudents = students.filter(function(s) { return s.classId === classId; });
  
  var html = '<option value="">-- Select Student --</option>';
  classStudents.forEach(function(s) {
    html += '<option value="' + s.id + '">' + s.name + ' (' + s.admissionNo + ')</option>';
  });
  studentSelect.innerHTML = html;
}

function getGrade(score) {
  var gradeScale = DB.get('gradeScale') || [];
  for (var i = 0; i < gradeScale.length; i++) {
    if (score >= gradeScale[i].min && score <= gradeScale[i].max) {
      return gradeScale[i];
    }
  }
  return { grade: 'F', remark: 'Fail' };
}

function getTeacherComment(average) {
  if (average >= 90) return 'Outstanding performance. Keep it up!';
  if (average >= 80) return 'Excellent work. Very impressive!';
  if (average >= 70) return 'Good performance. Continue striving.';
  if (average >= 60) return 'Satisfactory. Work on weak areas.';
  if (average >= 50) return 'Pass. More effort needed.';
  if (average >= 40) return 'Barely passed. Work harder.';
  return 'Failed. Immediate intervention required.';
}

function generateReportCard() {
  var classId = document.getElementById('rcClass').value;
  var studentId = document.getElementById('rcStudent').value;
  var term = document.getElementById('rcTerm').value;
  var session = document.getElementById('rcSession').value;
  
  if (!classId || !studentId) {
    alert('Please select class and student');
    return;
  }
  
  var settings = DB.get('settings') || {};
  var schoolName = settings.schoolName || 'Folusho Victory Schools';
  session = session || settings.session || '2024/2025';
  
  var classes = DB.get('classes') || [];
  var cls = classes.find(function(c) { return c.id === classId; });

  var students = DB.get('students') || [];
  var student = students.find(function(s) { return s.id === studentId; });
  
  var subjects = getSubjectsForClass(classId);
  var scores = DB.get('scores') || [];
  
  var studentScores = [];
  subjects.forEach(function(sub) {
    var sc = scores.find(function(s) { return s.studentId === studentId && s.subjectId === sub.id; });
    var score = sc ? sc.score : 0;
    var gradeInfo = getGrade(score);
    studentScores.push({
      subject: sub,
      score: score,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark
    });
  });
  
  var totalScore = 0;
  studentScores.forEach(function(s) { totalScore += s.score; });
  var average = studentScores.length > 0 ? Math.round(totalScore / studentScores.length) : 0;
  var finalGrade = getGrade(average);
  var comment = getTeacherComment(average);
  
  var position = 1;
  var classStudents = students.filter(function(s) { return s.classId === classId; });
  classStudents.forEach(function(s) {
    if (s.id === studentId) return;
    var sTotal = 0;
    subjects.forEach(function(sub) {
      var sc = scores.find(function(x) { return x.studentId === s.id && x.subjectId === sub.id; });
      sTotal += sc ? sc.score : 0;
    });
    if (sTotal > totalScore) position++;
  });
  
  var output = document.getElementById('reportCardOutput');
  output.innerHTML = 
    '<div class="report-card" style="background:white;padding:30px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);max-width:800px;margin:20px auto;font-family:Segoe UI,sans-serif;">' +
      '<div style="text-align:center;margin-bottom:25px;border-bottom:3px solid #7c3aed;padding-bottom:15px;">' +
        '<h1 style="color:#7c3aed;margin:0;font-size:28px;">' + schoolName + '</h1>' +
        '<p style="color:#666;margin:5px 0;">Report Card</p>' +
        '<p style="color:#888;font-size:14px;">' + term + ', ' + session + '</p>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:20px;padding:15px;background:#f8f9fa;border-radius:8px;">' +
        '<div><strong>Student Name:</strong> ' + student.name + '</div>' +
        '<div><strong>Admission No:</strong> ' + student.admissionNo + '</div>' +
        '<div><strong>Class:</strong> ' + (cls ? cls.name : '-') + '</div>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
        '<thead><tr style="background:#7c3aed;color:white;">' +
          '<th style="padding:12px;text-align:left;">Subject</th>' +
          '<th style="padding:12px;text-align:center;">Score</th>' +
          '<th style="padding:12px;text-align:center;">Grade</th>' +
          '<th style="padding:12px;text-align:center;">Remark</th>' +
        '</tr></thead>' +
        '<tbody>';
  
  studentScores.forEach(function(s) {
    output.innerHTML += 
      '<tr style="border-bottom:1px solid #eee;">' +
        '<td style="padding:12px;">' + s.subject.name + '</td>' +
        '<td style="padding:12px;text-align:center;">' + s.score + '</td>' +
        '<td style="padding:12px;text-align:center;"><strong>' + s.grade + '</strong></td>' +
        '<td style="padding:12px;text-align:center;color:#666;">' + s.remark + '</td>' +
      '</tr>';
  });
  
  output.innerHTML += 
        '</tbody>' +
      '</table>' +
      '<div style="display:flex;justify-content:space-between;padding:15px;background:#f8f9fa;border-radius:8px;margin-bottom:20px;">' +
        '<div><strong>Total Score:</strong> ' + totalScore + '</div>' +
        '<div><strong>Average:</strong> ' + average + '</div>' +
        '<div><strong>Grade:</strong> ' + finalGrade.grade + '</div>' +
        '<div><strong>Position:</strong> ' + position + ' of ' + classStudents.length + '</div>' +
      '</div>' +
      '<div style="padding:15px;background:#fef3c7;border-radius:8px;border-left:4px solid #d97706;">' +
        '<strong>Teacher\'s Comment:</strong><br>' +
        '<span style="font-size:16px;">' + comment + '</span>' +
      '</div>' +
      '<div style="margin-top:25px;padding-top:15px;border-top:2px solid #eee;text-align:center;color:#888;font-size:12px;">' +
        'Generated by EduResult Pro' +
      '</div>' +
    '</div>' +
    '<div style="text-align:center;margin-top:15px;">' +
      '<button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Print</button>' +
    '</div>';
}

// ============================================================
// COMPUTE RESULTS
// ============================================================
function computeResults() {
  var classId = document.getElementById('computeClass').value;
  if (!classId) {
    alert('Please select a class');
    return;
  }
  
  var students = DB.get('students') || [];
  var classes = DB.get('classes') || [];
  var subjects = DB.get('subjects') || [];
  var scores = DB.get('scores') || [];
  
  var classStudents = students.filter(function(s) { return s.classId === classId; });
  var classSubjects = subjects.filter(function(s) { return s.classId === classId; });
  var cls = classes.find(function(c) { return c.id === classId; });
  
  if (classStudents.length === 0 || classSubjects.length === 0) {
    alert('This class needs students and subjects to compute results');
    return;
  }
  
  var results = [];
  
  classStudents.forEach(function(student) {
    var totalScore = 0;
    var subjectCount = 0;
    
    classSubjects.forEach(function(subject) {
      var score = scores.find(function(s) { 
        return s.studentId === student.id && s.subjectId === subject.id; 
      });
      if (score) {
        totalScore += score.score;
        subjectCount++;
      }
    });
    
    var average = subjectCount > 0 ? Math.round(totalScore / subjectCount) : 0;
    var gradeInfo = getGrade(average);
    
    results.push({
      studentId: student.id,
      student: student.name,
      admNo: student.admissionNo,
      average: average,
      totalScore: totalScore,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark
    });
  });
  
  // Sort by average descending
  results.sort(function(a, b) { return b.average - a.average; });
  
  var area = document.getElementById('resultArea');
  var html = '<div class="card"><h3>Results for ' + (cls ? cls.name : 'Selected Class') + '</h3>';
  html += '<table class="table"><thead><tr><th>Position</th><th>Adm No</th><th>Student Name</th><th>Average</th><th>Grade</th><th>Remark</th></tr></thead><tbody>';
  
  results.forEach(function(r, idx) {
    html += '<tr><td>' + (idx+1) + '</td><td>' + r.admNo + '</td><td>' + r.student + '</td><td>' + r.average + '</td><td><strong>' + r.grade + '</strong></td><td>' + r.remark + '</td></tr>';
  });
  
  html += '</tbody></table></div>';
  area.innerHTML = html;
  
  alert('Results computed successfully!');
}

function updateComputeClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('computeClass');
  var html = '<option value="">-- Select Class --</option>';
  
  var filteredClasses = classes;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filteredClasses = classes.filter(function(c) { return c.id === currentUser.classId; });
  }
  
  filteredClasses.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

// ============================================================
// VIEW RESULTS
// ============================================================
function viewResults() {
  var classId = document.getElementById('viewClass').value;
  if (!classId) {
    document.getElementById('viewArea').innerHTML = '';
    return;
  }
  
  var students = DB.get('students') || [];
  var classes = DB.get('classes') || [];
  var subjects = DB.get('subjects') || [];
  var scores = DB.get('scores') || [];
  
  var classStudents = students.filter(function(s) { return s.classId === classId; });
  var classSubjects = subjects.filter(function(s) { return s.classId === classId; });
  var cls = classes.find(function(c) { return c.id === classId; });
  
  var results = [];
  
  classStudents.forEach(function(student) {
    var totalScore = 0;
    var subjectCount = 0;
    
    classSubjects.forEach(function(subject) {
      var score = scores.find(function(s) { 
        return s.studentId === student.id && s.subjectId === subject.id; 
      });
      if (score) {
        totalScore += score.score;
        subjectCount++;
      }
    });
    
    var average = subjectCount > 0 ? Math.round(totalScore / subjectCount) : 0;
    var gradeInfo = getGrade(average);
    
    results.push({
      studentId: student.id,
      student: student.name,
      admNo: student.admissionNo,
      average: average,
      totalScore: totalScore,
      grade: gradeInfo.grade,
      remark: gradeInfo.remark
    });
  });
  
  // Sort by average descending
  results.sort(function(a, b) { return b.average - a.average; });
  
  var area = document.getElementById('viewArea');
  var html = '<div class="card"><h3>Results for ' + (cls ? cls.name : 'Selected Class') + '</h3>';
  html += '<table class="table"><thead><tr><th>Position</th><th>Adm No</th><th>Student Name</th><th>Average</th><th>Grade</th><th>Remark</th></tr></thead><tbody>';
  
  results.forEach(function(r, idx) {
    html += '<tr><td>' + (idx+1) + '</td><td>' + r.admNo + '</td><td>' + r.student + '</td><td>' + r.average + '</td><td><strong>' + r.grade + '</strong></td><td>' + r.remark + '</td></tr>';
  });
  
  html += '</tbody></table></div>';
  area.innerHTML = html;
}

function updateViewClassSelect() {
  var classes = DB.get('classes') || [];
  var select = document.getElementById('viewClass');
  var html = '<option value="">-- Select Class --</option>';
  
  var filteredClasses = classes;
  if (currentUser && currentUser.role === 'teacher' && currentUser.classId) {
    filteredClasses = classes.filter(function(c) { return c.id === currentUser.classId; });
  }
  
  filteredClasses.forEach(function(c) {
    html += '<option value="' + c.id + '">' + c.name + '</option>';
  });
  select.innerHTML = html;
}

// ============================================================
// THEME TOGGLE
// ============================================================
function toggleTheme() {
  var body = document.body;
  var icon = document.getElementById('themeIcon');
  
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    icon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark');
    icon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  }
}

// ============================================================
// PASSWORD MANAGEMENT
// ============================================================
function changePassword() {
  var oldPass = document.getElementById('oldPass').value;
  var newPass = document.getElementById('newPass').value;
  var confirmPass = document.getElementById('confirmPass').value;
  
  if (!oldPass || !newPass || !confirmPass) {
    alert('Please fill all password fields');
    return;
  }
  
  if (newPass !== confirmPass) {
    alert('New passwords do not match');
    return;
  }
  
  var users = DB.get('users') || [];
  var user = users.find(function(u) { return u.id === currentUser.id; });
  
  if (!user || user.password !== oldPass) {
    alert('Current password is incorrect');
    return;
  }
  
  user.password = newPass;
  DB.set('users', users);
  
  document.getElementById('oldPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
  
  alert('Password changed successfully!');
}

function teacherChangePassword() {
  var oldPass = document.getElementById('teacherOldPass').value;
  var newPass = document.getElementById('teacherNewPass').value;
  var confirmPass = document.getElementById('teacherConfirmPass').value;
  
  if (!oldPass || !newPass || !confirmPass) {
    alert('Please fill all password fields');
    return;
  }
  
  if (newPass !== confirmPass) {
    alert('New passwords do not match');
    return;
  }
  
  var users = DB.get('users') || [];
  var user = users.find(function(u) { return u.id === currentUser.id; });
  
  if (!user || user.password !== oldPass) {
    alert('Current password is incorrect');
    return;
  }
  
  user.password = newPass;
  DB.set('users', users);
  
  document.getElementById('teacherOldPass').value = '';
  document.getElementById('teacherNewPass').value = '';
  document.getElementById('teacherConfirmPass').value = '';
  
  alert('Password changed successfully!');
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  if (document.getElementById('themeIcon')) {
    document.getElementById('themeIcon').className = 'fas fa-sun';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Hide main app and show login on initial load
  var mainApp = document.getElementById('mainApp');
  var loginPage = document.getElementById('loginPage');
  
  if (mainApp && loginPage) {
    mainApp.style.display = 'none';
    loginPage.style.display = 'flex';
  }
  
  // Initialize first section as active
  var firstSection = document.getElementById('sec-dashboard');
  if (firstSection) {
    firstSection.classList.add('active');
  }
  
  // Set dashboard as active link
  var dashboardLink = document.querySelector('[data-section="dashboard"]');
  if (dashboardLink) {
    dashboardLink.classList.add('active');
  }
});