/* ============================================================
   EduResult Pro – Main Application JavaScript
   All data stored in localStorage
   ============================================================ */

'use strict';

// ============================================================
// DATA STORE (localStorage helpers)
// ============================================================
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('erp_' + key)) || null; }
    catch { return null; }
  },
  set(key, val) {
    localStorage.setItem('erp_' + key, JSON.stringify(val));
  },
  del(key) { localStorage.removeItem('erp_' + key); }
};

// ============================================================
// DEFAULT DATA SEEDS
// ============================================================
function seedDefaults() {
  if (!DB.get('users')) {
    DB.set('users', [
      { id: 'u1', name: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' }
    ]);
  }
  if (!DB.get('settings')) {
    DB.set('settings', {
      schoolName: 'EduResult School',
      address: '123 School Lane, Education City',
      phone: '08012345678',
      email: 'info@eduschool.com',
      session: '2024/2025',
      term: 'First Term',
      grading: 'percentage',
      motto: 'Excellence in Education',
      ca1Max: 10, ca2Max: 10, ca3Max: 10, examMax: 70
    });
  }
  if (!DB.get('gradeScale')) {
    DB.set('gradeScale', [
      { grade: 'A1', min: 75, max: 100, remark: 'Excellent' },
      { grade: 'B2', min: 70, max: 74,  remark: 'Very Good' },
      { grade: 'B3', min: 65, max: 69,  remark: 'Good' },
      { grade: 'C4', min: 60, max: 64,  remark: 'Credit' },
      { grade: 'C5', min: 55, max: 59,  remark: 'Credit' },
      { grade: 'C6', min: 50, max: 54,  remark: 'Credit' },
      { grade: 'D7', min: 45, max: 49,  remark: 'Pass' },
      { grade: 'E8', min: 40, max: 44,  remark: 'Pass' },
      { grade: 'F9', min: 0,  max: 39,  remark: 'Fail' }
    ]);
  }
  if (!DB.get('classes'))  DB.set('classes',  []);
  if (!DB.get('students')) DB.set('students', []);
  if (!DB.get('subjects')) DB.set('subjects', []);
  if (!DB.get('scores'))   DB.set('scores',   []);
  if (!DB.get('results'))  DB.set('results',  []);
}

// ============================================================
// UTILITIES
// ============================================================
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function levelLabel(lvl) {
  const m = { nursery: 'Nursery', primary: 'Primary', secondary: 'Secondary' };
  return m[lvl] || lvl;
}

function getStudentName(s) {
  return [s.surname, s.firstname, s.other].filter(Boolean).join(' ');
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getGradeInfo(score) {
  const scale = DB.get('gradeScale') || [];
  const s = Number(score);
  for (const g of scale) {
    if (s >= Number(g.min) && s <= Number(g.max)) return g;
  }
  return { grade: 'N/A', remark: 'N/A' };
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
let toastTimer;
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

// ============================================================
// MODAL
// ============================================================
let modalCallback = null;
function openModal(title, body, confirmCb, confirmText = 'Confirm', confirmClass = 'btn-danger') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  const btn = document.getElementById('modalConfirmBtn');
  btn.textContent = confirmText;
  btn.className = 'btn ' + confirmClass;
  modalCallback = confirmCb;
  btn.onclick = () => { if (modalCallback) modalCallback(); closeModal(); };
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  modalCallback = null;
}

// ============================================================
// AUTH
// ============================================================
let currentUser = null;

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const uname = document.getElementById('loginUsername').value.trim();
  const pass  = document.getElementById('loginPassword').value.trim();
  const level = document.getElementById('loginLevel').value;
  const users = DB.get('users') || [];
  const user  = users.find(u => u.username === uname && u.password === pass);
  if (!user) { showToast('Invalid username or password', 'error'); return; }
  currentUser = { ...user, level };
  loginSuccess();
});

function loginSuccess() {
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  document.getElementById('topbarUser').textContent = currentUser.name;
  document.getElementById('sidebarLevel').textContent = levelLabel(currentUser.level) + ' School';
  loadSettings();
  updateDashboard();
  populateAllSelects();
  loadGradeScaleTable();
  renderClassesTable();
  renderStudentsTable();
  renderSubjectsTable();
  renderUsersTable();
}

function logout() {
  openModal('Logout', 'Are you sure you want to logout?', () => {
    currentUser = null;
    document.getElementById('mainApp').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('loginForm').reset();
  }, 'Logout', 'btn-danger');
}

function togglePass() {
  const inp = document.getElementById('loginPassword');
  const icon = document.getElementById('eyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    inp.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ============================================================
// NAVIGATION
// ============================================================
document.querySelectorAll('.nav-link[data-section]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    goTo(this.dataset.section);
    // Close mobile sidebar
    if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
  });
});

function goTo(section) {
  // nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-section="${section}"]`);
  if (link) link.classList.add('active');
  // sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('sec-' + section);
  if (sec) sec.classList.add('active');
  // topbar title
  const titles = {
    'dashboard': 'Dashboard', 'school-settings': 'School Settings',
    'classes': 'Classes', 'students': 'Students', 'subjects': 'Subjects',
    'enter-scores': 'Enter Scores', 'compute-results': 'Compute Results',
    'view-results': 'View Results', 'report-card': 'Report Card', 'users': 'Users'
  };
  document.getElementById('topbarTitle').textContent = titles[section] || capitalize(section);
  // Refresh content
  if (section === 'dashboard') updateDashboard();
  if (section === 'enter-scores') populateScoreClassSelect();
  if (section === 'compute-results') populateComputeSelects();
  if (section === 'view-results') populateViewSelects();
  if (section === 'report-card') populateRCSelects();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============================================================
// SETTINGS
// ============================================================
function loadSettings() {
  const s = DB.get('settings') || {};
  document.getElementById('ss-name').value    = s.schoolName || '';
  document.getElementById('ss-address').value = s.address   || '';
  document.getElementById('ss-phone').value   = s.phone     || '';
  document.getElementById('ss-email').value   = s.email     || '';
  document.getElementById('ss-session').value = s.session   || '2024/2025';
  document.getElementById('ss-term').value    = s.term      || 'First Term';
  document.getElementById('ss-grading').value = s.grading   || 'percentage';
  document.getElementById('ss-motto').value   = s.motto     || '';
  document.getElementById('sb-ca1').value     = s.ca1Max ?? 10;
  document.getElementById('sb-ca2').value     = s.ca2Max ?? 10;
  document.getElementById('sb-ca3').value     = s.ca3Max ?? 10;
  document.getElementById('sb-exam').value    = s.examMax  ?? 70;
  // topbar
  document.getElementById('currentTerm').textContent    = s.term    || '';
  document.getElementById('currentSession').textContent = s.session || '';
  // pre-fill session in score/compute/view/rc forms
  ['scoreSession','computeSession','viewSession','rcSession'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = s.session || '';
  });
  // pre-fill term
  ['scoreTerm','computeTerm','viewTerm','rcTerm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = s.term || 'First Term';
  });
}

function saveSchoolSettings() {
  const ca1  = parseInt(document.getElementById('sb-ca1').value)  || 0;
  const ca2  = parseInt(document.getElementById('sb-ca2').value)  || 0;
  const ca3  = parseInt(document.getElementById('sb-ca3').value)  || 0;
  const exam = parseInt(document.getElementById('sb-exam').value) || 0;
  if (ca1 + ca2 + ca3 + exam !== 100) {
    showToast('Score breakdown must total 100!', 'error'); return;
  }
  const s = {
    schoolName: document.getElementById('ss-name').value.trim(),
    address:    document.getElementById('ss-address').value.trim(),
    phone:      document.getElementById('ss-phone').value.trim(),
    email:      document.getElementById('ss-email').value.trim(),
    session:    document.getElementById('ss-session').value.trim(),
    term:       document.getElementById('ss-term').value,
    grading:    document.getElementById('ss-grading').value,
    motto:      document.getElementById('ss-motto').value.trim(),
    ca1Max: ca1, ca2Max: ca2, ca3Max: ca3, examMax: exam
  };
  DB.set('settings', s);
  loadSettings();
  showToast('School settings saved!', 'success');
}

// ============================================================
// GRADE SCALE
// ============================================================
function loadGradeScaleTable() {
  const scale = DB.get('gradeScale') || [];
  renderGradeTable(scale);
}

function renderGradeTable(scale) {
  const tbody = document.getElementById('gradeTableBody');
  tbody.innerHTML = '';
  scale.forEach((g, i) => {
    tbody.innerHTML += `
      <tr>
        <td><input class="grade-input" style="width:60px" data-idx="${i}" data-field="grade" value="${g.grade}"/></td>
        <td><input class="grade-input" type="number" style="width:70px" data-idx="${i}" data-field="min" value="${g.min}"/></td>
        <td><input class="grade-input" type="number" style="width:70px" data-idx="${i}" data-field="max" value="${g.max}"/></td>
        <td><input class="grade-input" style="width:120px" data-idx="${i}" data-field="remark" value="${g.remark}"/></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeGradeRow(${i})"><i class="fas fa-trash"></i></button></td>
      </tr>`;
  });
}

function addGradeRow() {
  const scale = DB.get('gradeScale') || [];
  scale.push({ grade: '', min: 0, max: 0, remark: '' });
  DB.set('gradeScale', scale);
  renderGradeTable(scale);
}

function removeGradeRow(idx) {
  const scale = DB.get('gradeScale') || [];
  scale.splice(idx, 1);
  DB.set('gradeScale', scale);
  renderGradeTable(scale);
}

function saveGradeScale() {
  const rows = document.querySelectorAll('#gradeTableBody tr');
  const scale = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('.grade-input');
    scale.push({
      grade:  inputs[0].value.trim(),
      min:    Number(inputs[1].value),
      max:    Number(inputs[2].value),
      remark: inputs[3].value.trim()
    });
  });
  DB.set('gradeScale', scale);
  showToast('Grade scale saved!', 'success');
}

// ============================================================
// CLASSES
// ============================================================
function addClass() {
  const name  = document.getElementById('classNameInput').value.trim();
  const level = document.getElementById('classLevelInput').value;
  const teacher = document.getElementById('classTeacherInput').value.trim();
  if (!name) { showToast('Enter class name', 'error'); return; }
  const classes = DB.get('classes') || [];
  if (classes.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast('Class already exists!', 'error'); return;
  }
  classes.push({ id: uid(), name, level, teacher });
  DB.set('classes', classes);
  document.getElementById('classNameInput').value    = '';
  document.getElementById('classTeacherInput').value = '';
  renderClassesTable();
  populateAllSelects();
  showToast('Class added successfully!', 'success');
}

function renderClassesTable() {
  const classes  = DB.get('classes')  || [];
  const students = DB.get('students') || [];
  const tbody = document.getElementById('classesTableBody');
  if (!classes.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-chalkboard"></i><p>No classes added yet</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = classes.map((c, i) => {
    const count = students.filter(s => s.classId === c.id).length;
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${c.name}</strong></td>
      <td><span class="badge badge-primary">${levelLabel(c.level)}</span></td>
      <td>${c.teacher || '<span class="text-muted">—</span>'}</td>
      <td><span class="badge badge-success">${count}</span></td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editClass('${c.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteClass('${c.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function editClass(id) {
  const classes = DB.get('classes') || [];
  const c = classes.find(x => x.id === id);
  if (!c) return;
  document.getElementById('classNameInput').value    = c.name;
  document.getElementById('classLevelInput').value   = c.level;
  document.getElementById('classTeacherInput').value = c.teacher || '';
  // replace add button behavior
  const btn = document.querySelector('#sec-classes .btn-primary');
  btn.innerHTML = '<i class="fas fa-save"></i> Update Class';
  btn.onclick = () => updateClass(id);
}

function updateClass(id) {
  const classes = DB.get('classes') || [];
  const idx = classes.findIndex(x => x.id === id);
  if (idx < 0) return;
  classes[idx].name    = document.getElementById('classNameInput').value.trim();
  classes[idx].level   = document.getElementById('classLevelInput').value;
  classes[idx].teacher = document.getElementById('classTeacherInput').value.trim();
  DB.set('classes', classes);
  document.getElementById('classNameInput').value    = '';
  document.getElementById('classTeacherInput').value = '';
  const btn = document.querySelector('#sec-classes .btn-primary');
  btn.innerHTML = '<i class="fas fa-plus"></i> Add Class';
  btn.onclick = addClass;
  renderClassesTable();
  populateAllSelects();
  showToast('Class updated!', 'success');
}

function deleteClass(id) {
  openModal('Delete Class', 'Are you sure? All students and subjects in this class will also be affected.', () => {
    let classes = DB.get('classes') || [];
    classes = classes.filter(c => c.id !== id);
    DB.set('classes', classes);
    renderClassesTable();
    populateAllSelects();
    showToast('Class deleted!', 'info');
  });
}

// ============================================================
// STUDENTS
// ============================================================
function saveStudent() {
  const surname   = document.getElementById('std-surname').value.trim();
  const firstname = document.getElementById('std-firstname').value.trim();
  const classId   = document.getElementById('std-class').value;
  if (!surname || !firstname) { showToast('Surname and First name are required', 'error'); return; }
  if (!classId) { showToast('Please select a class', 'error'); return; }

  const students = DB.get('students') || [];
  const editId   = document.getElementById('studentId').value;

  if (editId) {
    const idx = students.findIndex(s => s.id === editId);
    if (idx >= 0) {
      students[idx] = { ...students[idx], ...getStudentFormData() };
      DB.set('students', students);
      showToast('Student updated!', 'success');
    }
  } else {
    const admNo = document.getElementById('std-admno').value.trim();
    if (admNo && students.find(s => s.admno === admNo)) {
      showToast('Admission number already exists!', 'error'); return;
    }
    students.push({ id: uid(), ...getStudentFormData() });
    DB.set('students', students);
    showToast('Student added!', 'success');
  }
  clearStudentForm();
  renderStudentsTable();
  updateDashboard();
}

function getStudentFormData() {
  return {
    surname:   document.getElementById('std-surname').value.trim(),
    firstname: document.getElementById('std-firstname').value.trim(),
    other:     document.getElementById('std-other').value.trim(),
    admno:     document.getElementById('std-admno').value.trim(),
    classId:   document.getElementById('std-class').value,
    gender:    document.getElementById('std-gender').value,
    dob:       document.getElementById('std-dob').value,
    parent:    document.getElementById('std-parent').value.trim(),
    phone:     document.getElementById('std-phone').value.trim(),
    address:   document.getElementById('std-address').value.trim(),
  };
}

function clearStudentForm() {
  document.getElementById('studentId').value   = '';
  document.getElementById('std-surname').value   = '';
  document.getElementById('std-firstname').value = '';
  document.getElementById('std-other').value     = '';
  document.getElementById('std-admno').value     = '';
  document.getElementById('std-class').value     = '';
  document.getElementById('std-gender').value    = 'Male';
  document.getElementById('std-dob').value       = '';
  document.getElementById('std-parent').value    = '';
  document.getElementById('std-phone').value     = '';
  document.getElementById('std-address').value   = '';
}

function renderStudentsTable() {
  const students = DB.get('students') || [];
  const classes  = DB.get('classes')  || [];
  const filterClass  = document.getElementById('filterStudentClass').value;
  const searchText   = (document.getElementById('searchStudent').value || '').toLowerCase();

  let filtered = students;
  if (filterClass)  filtered = filtered.filter(s => s.classId === filterClass);
  if (searchText)   filtered = filtered.filter(s =>
    getStudentName(s).toLowerCase().includes(searchText) ||
    (s.admno || '').toLowerCase().includes(searchText)
  );

  const tbody = document.getElementById('studentsTableBody');
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-user-graduate"></i><p>No students found</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((s, i) => {
    const cls = classes.find(c => c.id === s.classId);
    return `<tr>
      <td>${i + 1}</td>
      <td>${s.admno || '—'}</td>
      <td><strong>${getStudentName(s)}</strong></td>
      <td>${cls ? cls.name : '<span class="text-muted">—</span>'}</td>
      <td><span class="badge ${s.gender === 'Male' ? 'badge-primary' : 'badge-warning'}">${s.gender}</span></td>
      <td>${s.parent || '—'}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function editStudent(id) {
  const students = DB.get('students') || [];
  const s = students.find(x => x.id === id);
  if (!s) return;
  document.getElementById('studentId').value     = s.id;
  document.getElementById('std-surname').value   = s.surname   || '';
  document.getElementById('std-firstname').value = s.firstname || '';
  document.getElementById('std-other').value     = s.other     || '';
  document.getElementById('std-admno').value     = s.admno     || '';
  document.getElementById('std-class').value     = s.classId   || '';
  document.getElementById('std-gender').value    = s.gender    || 'Male';
  document.getElementById('std-dob').value       = s.dob       || '';
  document.getElementById('std-parent').value    = s.parent    || '';
  document.getElementById('std-phone').value     = s.phone     || '';
  document.getElementById('std-address').value   = s.address   || '';
  document.getElementById('std-surname').scrollIntoView({ behavior: 'smooth' });
}

function deleteStudent(id) {
  openModal('Delete Student', 'Are you sure you want to delete this student? Their scores will also be removed.', () => {
    let students = DB.get('students') || [];
    students = students.filter(s => s.id !== id);
    DB.set('students', students);
    // also remove scores
    let scores = DB.get('scores') || [];
    scores = scores.filter(s => s.studentId !== id);
    DB.set('scores', scores);
    renderStudentsTable();
    updateDashboard();
    showToast('Student deleted!', 'info');
  });
}

// ============================================================
// SUBJECTS
// ============================================================
function saveSubject() {
  const name     = document.getElementById('sub-name').value.trim();
  const code     = document.getElementById('sub-code').value.trim().toUpperCase();
  const classId  = document.getElementById('sub-class').value;
  const category = document.getElementById('sub-category').value;
  if (!name)    { showToast('Subject name is required', 'error'); return; }
  if (!classId) { showToast('Please assign to a class', 'error'); return; }

  const subjects = DB.get('subjects') || [];
  const editId   = document.getElementById('subjectId').value;

  if (editId) {
    const idx = subjects.findIndex(s => s.id === editId);
    if (idx >= 0) {
      subjects[idx] = { ...subjects[idx], name, code, classId, category };
      DB.set('subjects', subjects);
      showToast('Subject updated!', 'success');
    }
  } else {
    subjects.push({ id: uid(), name, code, classId, category });
    DB.set('subjects', subjects);
    showToast('Subject added!', 'success');
  }
  clearSubjectForm();
  renderSubjectsTable();
}

function clearSubjectForm() {
  document.getElementById('subjectId').value    = '';
  document.getElementById('sub-name').value     = '';
  document.getElementById('sub-code').value     = '';
  document.getElementById('sub-class').value    = '';
  document.getElementById('sub-category').value = 'compulsory';
}

function renderSubjectsTable() {
  const subjects = DB.get('subjects') || [];
  const classes  = DB.get('classes')  || [];
  const filter   = document.getElementById('filterSubjectClass').value;
  const filtered = filter ? subjects.filter(s => s.classId === filter) : subjects;
  const tbody    = document.getElementById('subjectsTableBody');

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-book"></i><p>No subjects found</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((s, i) => {
    const cls = classes.find(c => c.id === s.classId);
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td><span class="badge badge-info">${s.code || '—'}</span></td>
      <td>${cls ? cls.name : '—'}</td>
      <td><span class="badge ${s.category === 'compulsory' ? 'badge-success' : 'badge-warning'}">${capitalize(s.category)}</span></td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editSubject('${s.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteSubject('${s.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function editSubject(id) {
  const subjects = DB.get('subjects') || [];
  const s = subjects.find(x => x.id === id);
  if (!s) return;
  document.getElementById('subjectId').value    = s.id;
  document.getElementById('sub-name').value     = s.name;
  document.getElementById('sub-code').value     = s.code     || '';
  document.getElementById('sub-class').value    = s.classId  || '';
  document.getElementById('sub-category').value = s.category || 'compulsory';
}

function deleteSubject(id) {
  openModal('Delete Subject', 'Delete this subject? Associated scores will be removed.', () => {
    let subjects = DB.get('subjects') || [];
    subjects = subjects.filter(s => s.id !== id);
    DB.set('subjects', subjects);
    let scores = DB.get('scores') || [];
    scores = scores.filter(sc => sc.subjectId !== id);
    DB.set('scores', scores);
    renderSubjectsTable();
    showToast('Subject deleted!', 'info');
  });
}

// ============================================================
// POPULATE SELECTS (run after data changes)
// ============================================================
function populateAllSelects() {
  const classes = DB.get('classes') || [];
  const opts = classes.map(c => `<option value="${c.id}">${c.name} (${levelLabel(c.level)})</option>`).join('');
  const blank = '<option value="">-- Select Class --</option>';

  ['std-class', 'sub-class', 'scoreClass', 'computeClass',
   'viewClass', 'rcClass', 'filterStudentClass',
   'filterSubjectClass'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const isFilter = id.startsWith('filter');
    el.innerHTML = (isFilter ? '<option value="">All Classes</option>' : blank) + opts;
  });
}

function populateScoreClassSelect() {
  populateAllSelects();
}

function populateComputeSelects() {
  populateAllSelects();
  const s = DB.get('settings') || {};
  const cs = document.getElementById('computeSession');
  const ct = document.getElementById('computeTerm');
  if (cs && !cs.value) cs.value = s.session || '';
  if (ct && !ct.value) ct.value = s.term || 'First Term';
}

function populateViewSelects() {
  populateAllSelects();
  const s = DB.get('settings') || {};
  const vs = document.getElementById('viewSession');
  const vt = document.getElementById('viewTerm');
  if (vs && !vs.value) vs.value = s.session || '';
  if (vt && !vt.value) vt.value = s.term || 'First Term';
}

function populateRCSelects() {
  populateAllSelects();
  const s = DB.get('settings') || {};
  const rs = document.getElementById('rcSession');
  const rt = document.getElementById('rcTerm');
  if (rs && !rs.value) rs.value = s.session || '';
  if (rt && !rt.value) rt.value = s.term || 'First Term';
}

// ============================================================
// ENTER SCORES
// ============================================================
function loadScoreSubjects() {
  const classId  = document.getElementById('scoreClass').value;
  const subjSel  = document.getElementById('scoreSubject');
  subjSel.innerHTML = '<option value="">-- Select Subject --</option>';
  document.getElementById('scoreSheetContainer').style.display = 'none';
  if (!classId) return;
  const subjects = DB.get('subjects') || [];
  subjects.filter(s => s.classId === classId).forEach(s => {
    subjSel.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });
}

function loadScoreSheet() {
  const classId   = document.getElementById('scoreClass').value;
  const subjectId = document.getElementById('scoreSubject').value;
  const term      = document.getElementById('scoreTerm').value;
  const session   = document.getElementById('scoreSession').value.trim();
  const container = document.getElementById('scoreSheetContainer');

  if (!classId || !subjectId) { container.style.display = 'none'; return; }

  const classes  = DB.get('classes')  || [];
  const students = DB.get('students') || [];
  const subjects = DB.get('subjects') || [];
  const scores   = DB.get('scores')   || [];
  const settings = DB.get('settings') || {};

  const cls  = classes.find(c => c.id === classId);
  const subj = subjects.find(s => s.id === subjectId);
  const classStudents = students.filter(s => s.classId === classId)
    .sort((a, b) => getStudentName(a).localeCompare(getStudentName(b)));

  if (!classStudents.length) {
    container.style.display = 'none';
    showToast('No students in this class', 'warning'); return;
  }

  const { ca1Max = 0, ca2Max = 0, ca3Max = 0, examMax = 70 } = settings;

  container.style.display = 'block';
  document.getElementById('scoreSheetTitle').textContent =
    `${subj ? subj.name : ''} – ${cls ? cls.name : ''} Score Sheet`;

  document.getElementById('scoreHeaderInfo').innerHTML = `
    <span><i class="fas fa-chalkboard"></i> Class: ${cls ? cls.name : ''}</span>
    <span><i class="fas fa-book"></i> Subject: ${subj ? subj.name : ''}</span>
    <span><i class="fas fa-calendar"></i> ${term} | ${session}</span>
    <span><i class="fas fa-users"></i> Students: ${classStudents.length}</span>`;

  // Build header
  const caHeaders = [];
  if (ca1Max > 0) caHeaders.push(`<th>CA1 <small>(/${ca1Max})</small></th>`);
  if (ca2Max > 0) caHeaders.push(`<th>CA2 <small>(/${ca2Max})</small></th>`);
  if (ca3Max > 0) caHeaders.push(`<th>CA3 <small>(/${ca3Max})</small></th>`);

  document.getElementById('scoreTableHead').innerHTML = `
    <tr>
      <th>#</th><th>Adm No.</th><th>Student Name</th>
      ${caHeaders.join('')}
      <th>Exam <small>(/${examMax})</small></th>
      <th>Total <small>(/100)</small></th>
      <th>Grade</th>
    </tr>`;

  // Build rows
  let rowsHTML = '';
  classStudents.forEach((st, i) => {
    const existing = scores.find(sc =>
      sc.studentId === st.id && sc.subjectId === subjectId &&
      sc.term === term && sc.session === session
    ) || {};

    const ca1v  = existing.ca1  ?? '';
    const ca2v  = existing.ca2  ?? '';
    const ca3v  = existing.ca3  ?? '';
    const examv = existing.exam ?? '';
    const totalv = existing.total ?? '';
    const gradev = existing.grade ?? '';

    const caInputs = [];
    if (ca1Max > 0) caInputs.push(`<td><input class="score-input" type="number" min="0" max="${ca1Max}" data-sid="${st.id}" data-field="ca1" value="${ca1v}" oninput="recalcRow(this)"/></td>`);
    if (ca2Max > 0) caInputs.push(`<td><input class="score-input" type="number" min="0" max="${ca2Max}" data-sid="${st.id}" data-field="ca2" value="${ca2v}" oninput="recalcRow(this)"/></td>`);
    if (ca3Max > 0) caInputs.push(`<td><input class="score-input" type="number" min="0" max="${ca3Max}" data-sid="${st.id}" data-field="ca3" value="${ca3v}" oninput="recalcRow(this)"/></td>`);

    rowsHTML += `
      <tr data-sid="${st.id}">
        <td>${i + 1}</td>
        <td>${st.admno || '—'}</td>
        <td><strong>${getStudentName(st)}</strong></td>
        ${caInputs.join('')}
        <td><input class="score-input" type="number" min="0" max="${examMax}" data-sid="${st.id}" data-field="exam" value="${examv}" oninput="recalcRow(this)"/></td>
        <td class="score-total" id="total-${st.id}">${totalv !== '' ? totalv : '—'}</td>
        <td id="grade-${st.id}">${gradev ? `<span class="badge badge-primary">${gradev}</span>` : '—'}</td>
      </tr>`;
  });
  document.getElementById('scoreTableBody').innerHTML = rowsHTML;
}

function recalcRow(input) {
  const sid     = input.dataset.sid;
  const row     = document.querySelector(`tr[data-sid="${sid}"]`);
  const settings = DB.get('settings') || {};
  const { ca1Max = 0, ca2Max = 0, ca3Max = 0, examMax = 70 } = settings;

  const get = (field) => {
    const el = row.querySelector(`[data-field="${field}"]`);
    return el ? parseFloat(el.value) || 0 : 0;
  };
  const getMax = (field) => {
    const el = row.querySelector(`[data-field="${field}"]`);
    return el ? parseFloat(el.max) || 0 : 0;
  };

  // Validate ranges
  ['ca1','ca2','ca3','exam'].forEach(f => {
    const el = row.querySelector(`[data-field="${f}"]`);
    if (!el) return;
    const v = parseFloat(el.value);
    const mx = parseFloat(el.max);
    if (!isNaN(v) && v > mx) { el.value = mx; el.classList.add('error'); }
    else el.classList.remove('error');
  });

  const ca1  = get('ca1');
  const ca2  = get('ca2');
  const ca3  = get('ca3');
  const exam = get('exam');
  const total = ca1 + ca2 + ca3 + exam;

  const totalCell = document.getElementById('total-' + sid);
  const gradeCell = document.getElementById('grade-' + sid);
  if (totalCell) totalCell.textContent = total;
  if (gradeCell) {
    const gi = getGradeInfo(total);
    gradeCell.innerHTML = `<span class="badge badge-primary">${gi.grade}</span>`;
  }
}

function saveScores() {
  const classId   = document.getElementById('scoreClass').value;
  const subjectId = document.getElementById('scoreSubject').value;
  const term      = document.getElementById('scoreTerm').value;
  const session   = document.getElementById('scoreSession').value.trim();

  if (!classId || !subjectId || !session) {
    showToast('Please fill all fields', 'error'); return;
  }

  const students = DB.get('students') || [];
  const settings = DB.get('settings') || {};
  const { ca1Max = 0, ca2Max = 0, ca3Max = 0 } = settings;
  let scores = DB.get('scores') || [];

  const classStudents = students.filter(s => s.classId === classId);
  let saved = 0;

  classStudents.forEach(st => {
    const row = document.querySelector(`tr[data-sid="${st.id}"]`);
    if (!row) return;

    const get = (f) => {
      const el = row.querySelector(`[data-field="${f}"]`);
      return el ? parseFloat(el.value) || 0 : 0;
    };

    const ca1  = ca1Max > 0 ? get('ca1')  : 0;
    const ca2  = ca2Max > 0 ? get('ca2')  : 0;
    const ca3  = ca3Max > 0 ? get('ca3')  : 0;
    const exam = get('exam');
    const total = ca1 + ca2 + ca3 + exam;
    const gi    = getGradeInfo(total);

    // Remove existing
    scores = scores.filter(sc => !(sc.studentId === st.id && sc.subjectId === subjectId && sc.term === term && sc.session === session));
    scores.push({ id: uid(), studentId: st.id, subjectId, classId, term, session, ca1, ca2, ca3, exam, total, grade: gi.grade, remark: gi.remark });
    saved++;
  });

  DB.set('scores', scores);
  showToast(`Scores saved for ${saved} students!`, 'success');
}

// ============================================================
// COMPUTE RESULTS
// ============================================================
function computeResults() {
  const classId = document.getElementById('computeClass').value;
  const term    = document.getElementById('computeTerm').value;
  const session = document.getElementById('computeSession').value.trim();

  if (!classId || !session) { showToast('Select class and session', 'error'); return; }

  const students = DB.get('students') || [];
  const subjects = DB.get('subjects') || [];
  const scores   = DB.get('scores')   || [];
  const classes  = DB.get('classes')  || [];

  const cls = classes.find(c => c.id === classId);
  const classStudents = students.filter(s => s.classId === classId);
  const classSubjects = subjects.filter(s => s.classId === classId);

  if (!classStudents.length) { showToast('No students in this class', 'warning'); return; }
  if (!classSubjects.length) { showToast('No subjects for this class', 'warning'); return; }

  // Calculate per student
  const computedStudents = classStudents.map(student => {
    let totalScore = 0, subjectCount = 0, passed = 0, failed = 0;
    const subjectScores = classSubjects.map(subj => {
      const sc = scores.find(x => x.studentId === student.id && x.subjectId === subj.id && x.term === term && x.session === session);
      const total = sc ? sc.total : 0;
      const gi    = sc ? { grade: sc.grade, remark: sc.remark } : getGradeInfo(0);
      if (sc) { subjectCount++; totalScore += total; }
      if (total >= 40) passed++; else failed++;
      return { subjectId: subj.id, subjectName: subj.name, total, grade: gi.grade, remark: gi.remark };
    });
    const average     = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : '0.0';
    const totalMarks  = totalScore;
    const subjectsOffered = subjectCount;
    return { studentId: student.id, name: getStudentName(student), admno: student.admno || '', subjectScores, totalMarks, average: parseFloat(average), subjectsOffered, passed, failed, position: 0 };
  });

  // Rank by average (descending)
  computedStudents.sort((a, b) => b.average - a.average);
  computedStudents.forEach((st, i) => { st.position = i + 1; });

  // Save results
  let results = DB.get('results') || [];
  // Remove old
  results = results.filter(r => !(r.classId === classId && r.term === term && r.session === session));
  computedStudents.forEach(st => {
    results.push({ id: uid(), classId, term, session, ...st });
  });
  DB.set('results', results);

  // Show result table
  displayComputeResults(computedStudents, classSubjects, cls, term, session);
  showToast(`Results computed for ${computedStudents.length} students!`, 'success');
}

function displayComputeResults(students, subjects, cls, term, session) {
  const area = document.getElementById('computeResultArea');

  const subjectHeaders = subjects.map(s => `<th>${s.name}</th>`).join('');
  const rows = students.map(st => {
    const subCols = subjects.map(subj => {
      const sc = st.subjectScores.find(x => x.subjectId === subj.id);
      return `<td class="text-center">${sc ? sc.total : '—'}</td>`;
    }).join('');
    const posCls = st.position === 1 ? 'pos-1' : st.position === 2 ? 'pos-2' : st.position === 3 ? 'pos-3' : '';
    return `<tr>
      <td><span class="position-badge ${posCls}">${st.position}</span></td>
      <td>${st.admno || '—'}</td>
      <td><strong>${st.name}</strong></td>
      ${subCols}
      <td class="text-center fw-bold">${st.totalMarks}</td>
      <td class="text-center fw-bold text-primary">${st.average}</td>
      <td class="text-center"><span class="badge badge-success">${st.passed}</span></td>
      <td class="text-center"><span class="badge badge-danger">${st.failed}</span></td>
    </tr>`;
  }).join('');

  area.innerHTML = `
    <div class="compute-info-bar">
      <i class="fas fa-check-circle"></i>
      Results computed: ${cls ? cls.name : ''} | ${term} | ${session} | ${students.length} Students
    </div>
    <div class="card">
      <div class="table-toolbar">
        <h3><i class="fas fa-table"></i> Computed Results</h3>
      </div>
      <div class="table-scroll">
        <table class="table result-view-table">
          <thead>
            <tr>
              <th>Pos</th><th>Adm No.</th><th>Student Name</th>
              ${subjectHeaders}
              <th>Total</th><th>Avg</th><th>Passed</th><th>Failed</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
// VIEW RESULTS
// ============================================================
function loadViewResults() {
  const classId = document.getElementById('viewClass').value;
  const term    = document.getElementById('viewTerm').value;
  const session = document.getElementById('viewSession').value.trim();
  const area    = document.getElementById('viewResultsArea');

  if (!classId || !session) { area.innerHTML = ''; return; }

  const results  = DB.get('results') || [];
  const classes  = DB.get('classes') || [];
  const subjects = DB.get('subjects') || [];
  const cls      = classes.find(c => c.id === classId);

  const classResults = results.filter(r => r.classId === classId && r.term === term && r.session === session);
  if (!classResults.length) {
    area.innerHTML = `<div class="card"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>No results found. Please compute results first.</p></div></div>`;
    return;
  }

  classResults.sort((a, b) => a.position - b.position);
  const classSubjects = subjects.filter(s => s.classId === classId);

  const subjectHeaders = classSubjects.map(s => `<th>${s.name}</th>`).join('');
  const rows = classResults.map(st => {
    const subCols = classSubjects.map(subj => {
      const sc = (st.subjectScores || []).find(x => x.subjectId === subj.id);
      if (!sc || sc.total === undefined) return `<td class="text-center">—</td>`;
      const gi = getGradeInfo(sc.total);
      return `<td class="text-center">${sc.total}<br><small class="text-muted">${gi.grade}</small></td>`;
    }).join('');

    const posCls = st.position === 1 ? 'pos-1' : st.position === 2 ? 'pos-2' : st.position === 3 ? 'pos-3' : '';
    return `<tr>
      <td><span class="position-badge ${posCls}">${ordinal(st.position)}</span></td>
      <td>${st.admno || '—'}</td>
      <td><strong>${st.name}</strong></td>
      ${subCols}
      <td class="text-center fw-bold">${st.totalMarks}</td>
      <td class="text-center fw-bold text-primary">${st.average}</td>
    </tr>`;
  }).join('');

  area.innerHTML = `
    <div class="card">
      <div class="table-toolbar">
        <h3><i class="fas fa-list-alt"></i> ${cls ? cls.name : ''} – ${term} Results (${session})</h3>
        <span class="badge badge-primary">${classResults.length} Students</span>
      </div>
      <div class="table-scroll">
        <table class="table result-view-table">
          <thead>
            <tr>
              <th>Position</th><th>Adm No.</th><th>Student Name</th>
              ${subjectHeaders}
              <th>Total</th><th>Average</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
// REPORT CARD
// ============================================================
function loadRCStudents() {
  const classId = document.getElementById('rcClass').value;
  const sel = document.getElementById('rcStudent');
  sel.innerHTML = '<option value="">-- Select Student --</option>';
  if (!classId) return;
  const students = DB.get('students') || [];
  students.filter(s => s.classId === classId)
    .sort((a, b) => getStudentName(a).localeCompare(getStudentName(b)))
    .forEach(s => {
      sel.innerHTML += `<option value="${s.id}">${getStudentName(s)}</option>`;
    });
}

function generateReportCard() {
  const classId   = document.getElementById('rcClass').value;
  const studentId = document.getElementById('rcStudent').value;
  const term      = document.getElementById('rcTerm').value;
  const session   = document.getElementById('rcSession').value.trim();

  if (!classId || !studentId || !session) {
    showToast('Please fill all fields', 'error'); return;
  }

  const students = DB.get('students') || [];
  const classes  = DB.get('classes')  || [];
  const subjects = DB.get('subjects') || [];
  const scores   = DB.get('scores')   || [];
  const results  = DB.get('results')  || [];
  const settings = DB.get('settings') || {};
  const gradeScale = DB.get('gradeScale') || [];

  const student = students.find(s => s.id === studentId);
  const cls     = classes.find(c => c.id === classId);
  if (!student) { showToast('Student not found', 'error'); return; }

  const classSubjects = subjects.filter(s => s.classId === classId);
  const { ca1Max = 0, ca2Max = 0, ca3Max = 0, examMax = 70 } = settings;

  // Get student scores for each subject
  const subjectRows = classSubjects.map((subj, idx) => {
    const sc = scores.find(x => x.studentId === studentId && x.subjectId === subj.id && x.term === term && x.session === session);
    const gi = sc ? { grade: sc.grade, remark: sc.remark } : getGradeInfo(0);
    const total = sc ? sc.total : 0;

    // Class stats for this subject
    const classScores = scores
      .filter(x => x.subjectId === subj.id && x.term === term && x.session === session && x.classId === classId)
      .map(x => x.total);
    const highest = classScores.length ? Math.max(...classScores) : 0;
    const lowest  = classScores.length ? Math.min(...classScores) : 0;
    const avg     = classScores.length ? (classScores.reduce((a,b) => a+b,0)/classScores.length).toFixed(1) : '0.0';

    let caHtml = '';
    if (ca1Max > 0) caHtml += `<td>${sc ? sc.ca1 : 0}</td>`;
    if (ca2Max > 0) caHtml += `<td>${sc ? sc.ca2 : 0}</td>`;
    if (ca3Max > 0) caHtml += `<td>${sc ? sc.ca3 : 0}</td>`;

    return `<tr>
      <td>${idx + 1}</td>
      <td>${subj.name}</td>
      ${caHtml}
      <td>${sc ? sc.exam : 0}</td>
      <td><strong>${total}</strong></td>
      <td><strong>${gi.grade}</strong></td>
      <td>${gi.remark}</td>
      <td>${highest}</td>
      <td>${lowest}</td>
      <td>${avg}</td>
    </tr>`;
  });

  // Student result from computed results
  const studentResult = results.find(r => r.studentId === studentId && r.classId === classId && r.term === term && r.session === session);
  const totalScore  = studentResult ? studentResult.totalMarks : 0;
  const average     = studentResult ? studentResult.average : '0.0';
  const position    = studentResult ? studentResult.position : '—';
  const classSize   = results.filter(r => r.classId === classId && r.term === term && r.session === session).length;
  const overallGI   = getGradeInfo(parseFloat(average));

  // Attendance
  const daysOpened   = '—';
  const daysPresent  = '—';

  // Next term date
  const nextTermDate = '—';

  // CA headers
  let caThHtml = '';
  if (ca1Max > 0) caThHtml += `<th>CA1<br><small>/${ca1Max}</small></th>`;
  if (ca2Max > 0) caThHtml += `<th>CA2<br><small>/${ca2Max}</small></th>`;
  if (ca3Max > 0) caThHtml += `<th>CA3<br><small>/${ca3Max}</small></th>`;

  // Grade key
  const gradeKeyPills = gradeScale.map(g =>
    `<span class="rc-grade-pill">${g.grade}: ${g.min}–${g.max} (${g.remark})</span>`
  ).join('');

  // DOB / Age
  let age = '—';
  if (student.dob) {
    const dob = new Date(student.dob);
    const now = new Date();
    age = Math.floor((now - dob) / (365.25 * 24 * 3600 * 1000)) + ' yrs';
  }

  const rcHTML = `
    <div class="report-card" id="printableCard">
      <!-- HEADER -->
      <div class="rc-header">
        <div class="school-name">${settings.schoolName || 'EduResult School'}</div>
        <div class="school-address">${settings.address || ''} ${settings.phone ? '| Tel: ' + settings.phone : ''}</div>
        ${settings.motto ? `<div class="school-tagline">"${settings.motto}"</div>` : ''}
        <div class="rc-title">Student Report Card</div>
      </div>

      <!-- STUDENT INFO -->
      <div class="rc-student-info">
        <div class="rc-info-item"><span class="ri-label">Student's Name:</span><span class="ri-val">${getStudentName(student)}</span></div>
        <div class="rc-info-item"><span class="ri-label">Admission No.:</span><span class="ri-val">${student.admno || '—'}</span></div>
        <div class="rc-info-item"><span class="ri-label">Class:</span><span class="ri-val">${cls ? cls.name : '—'}</span></div>
        <div class="rc-info-item"><span class="ri-label">Gender:</span><span class="ri-val">${student.gender || '—'}</span></div>
        <div class="rc-info-item"><span class="ri-label">Date of Birth:</span><span class="ri-val">${student.dob || '—'}</span></div>
        <div class="rc-info-item"><span class="ri-label">Age:</span><span class="ri-val">${age}</span></div>
        <div class="rc-info-item"><span class="ri-label">Term:</span><span class="ri-val">${term}</span></div>
        <div class="rc-info-item"><span class="ri-label">Session:</span><span class="ri-val">${session}</span></div>
      </div>

      <!-- SUBJECT SCORES TABLE -->
      <table class="rc-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Subject</th>
            ${caThHtml}
            <th>Exam<br><small>/${examMax}</small></th>
            <th>Total<br><small>/100</small></th>
            <th>Grade</th>
            <th>Remark</th>
            <th>Highest</th>
            <th>Lowest</th>
            <th>Class Avg</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows.join('')}
          <tr class="total-row">
            <td colspan="${2 + (ca1Max>0?1:0) + (ca2Max>0?1:0) + (ca3Max>0?1:0) + 1}">TOTAL / AVERAGE</td>
            <td>${totalScore}</td>
            <td>${average}</td>
            <td>${overallGI.grade}</td>
            <td colspan="3">${overallGI.remark}</td>
          </tr>
        </tbody>
      </table>

      <!-- SUMMARY & STATISTICS -->
      <div class="rc-summary">
        <div class="rc-summary-box">
          <h4><i class="fas fa-chart-bar"></i> Academic Performance</h4>
          <div class="rc-stat-row"><span class="rs-label">Total Score:</span><span class="rs-val">${totalScore}</span></div>
          <div class="rc-stat-row"><span class="rs-label">Average Score:</span><span class="rs-val">${average}%</span></div>
          <div class="rc-stat-row"><span class="rs-label">Overall Grade:</span><span class="rs-val">${overallGI.grade} – ${overallGI.remark}</span></div>
          <div class="rc-stat-row"><span class="rs-label">Position in Class:</span><span class="rs-val">${ordinal(position)} / ${classSize}</span></div>
          <div class="rc-stat-row"><span class="rs-label">No. of Subjects:</span><span class="rs-val">${classSubjects.length}</span></div>
        </div>
        <div class="rc-summary-box">
          <h4><i class="fas fa-calendar-check"></i> Attendance</h4>
          <div class="rc-stat-row"><span class="rs-label">Days School Opened:</span><span class="rs-val">${daysOpened}</span></div>
          <div class="rc-stat-row"><span class="rs-label">Days Present:</span><span class="rs-val">${daysPresent}</span></div>
          <div class="rc-stat-row"><span class="rs-label">Class Teacher:</span><span class="rs-val">${cls ? (cls.teacher || '—') : '—'}</span></div>
          <div class="rc-stat-row"><span class="rs-label">Class Size:</span><span class="rs-val">${classSize}</span></div>
        </div>
      </div>

      <!-- GRADE KEY -->
      <div class="rc-grade-key">
        <h4>Grade Key</h4>
        <div class="rc-grade-row">${gradeKeyPills}</div>
      </div>

      <!-- NEXT TERM -->
      <div class="rc-next-term">
        <span class="nt-label"><i class="fas fa-calendar-alt"></i> Next Term Begins:</span>
        <span class="nt-val">${nextTermDate}</span>
      </div>

      <!-- REMARKS -->
      <div class="rc-remarks-section">
        <div class="rc-remark-box">
          <h4>Class Teacher's Remark</h4>
          <div class="rc-remark-text">${getAutoRemark(parseFloat(average))}</div>
          <div class="rc-remark-line"></div>
          <small class="text-muted">Signature & Date</small>
        </div>
        <div class="rc-remark-box">
          <h4>Head Teacher / Principal's Remark</h4>
          <div class="rc-remark-line"></div>
          <div class="rc-remark-line"></div>
          <small class="text-muted">Signature & Date</small>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="rc-footer">
        <p>This report card is computer-generated. &nbsp;|&nbsp; <strong>${settings.schoolName || 'EduResult School'}</strong> &nbsp;|&nbsp; ${session}</p>
      </div>
    </div>`;

  document.getElementById('reportCardArea').innerHTML = rcHTML;
}

function getAutoRemark(avg) {
  if (avg >= 75) return 'Excellent performance. Keep it up!';
  if (avg >= 65) return 'Very good performance. Well done!';
  if (avg >= 55) return 'Good performance. Keep working hard.';
  if (avg >= 45) return 'Fair performance. More effort needed.';
  if (avg >= 40) return 'Average performance. Must work harder.';
  return 'Poor performance. Needs serious improvement.';
}

function printReportCard() {
  const rc = document.getElementById('printableCard');
  if (!rc) { showToast('Generate a report card first', 'warning'); return; }
  window.print();
}

// ============================================================
// USERS
// ============================================================
function saveUser() {
  const name     = document.getElementById('user-name').value.trim();
  const username = document.getElementById('user-username').value.trim();
  const password = document.getElementById('user-password').value.trim();
  const role     = document.getElementById('user-role').value;
  if (!name || !username) { showToast('Name and username are required', 'error'); return; }

  const users  = DB.get('users') || [];
  const editId = document.getElementById('userId').value;

  if (editId) {
    const idx = users.findIndex(u => u.id === editId);
    if (idx >= 0) {
      users[idx].name     = name;
      users[idx].username = username;
      users[idx].role     = role;
      if (password) users[idx].password = password;
      DB.set('users', users);
      showToast('User updated!', 'success');
    }
  } else {
    if (users.find(u => u.username === username)) {
      showToast('Username already exists!', 'error'); return;
    }
    if (!password) { showToast('Password is required for new user', 'error'); return; }
    users.push({ id: uid(), name, username, password, role });
    DB.set('users', users);
    showToast('User added!', 'success');
  }
  clearUserForm();
  renderUsersTable();
}

function clearUserForm() {
  document.getElementById('userId').value        = '';
  document.getElementById('user-name').value     = '';
  document.getElementById('user-username').value = '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-role').value     = 'admin';
}

function renderUsersTable() {
  const users = DB.get('users') || [];
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${u.name}</strong></td>
      <td>${u.username}</td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'teacher' ? 'badge-primary' : 'badge-secondary'}">${capitalize(u.role)}</span></td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i></button>
        ${u.username !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>` : ''}
      </td>
    </tr>`).join('');
}

function editUser(id) {
  const users = DB.get('users') || [];
  const u = users.find(x => x.id === id);
  if (!u) return;
  document.getElementById('userId').value        = u.id;
  document.getElementById('user-name').value     = u.name;
  document.getElementById('user-username').value = u.username;
  document.getElementById('user-password').value = '';
  document.getElementById('user-role').value     = u.role;
}

function deleteUser(id) {
  openModal('Delete User', 'Are you sure you want to delete this user?', () => {
    let users = DB.get('users') || [];
    users = users.filter(u => u.id !== id);
    DB.set('users', users);
    renderUsersTable();
    showToast('User deleted!', 'info');
  });
}

// ============================================================
// DASHBOARD
// ============================================================
function updateDashboard() {
  const students = DB.get('students') || [];
  const classes  = DB.get('classes')  || [];
  const subjects = DB.get('subjects') || [];
  const users    = DB.get('users')    || [];
  const settings = DB.get('settings') || {};
  const results  = DB.get('results')  || [];

  const statsGrid = document.getElementById('dashboardStats');
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-users"></i></div>
      <div class="stat-info"><h4>Total Students</h4><p>${students.length}</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-chalkboard"></i></div>
      <div class="stat-info"><h4>Classes</h4><p>${classes.length}</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange"><i class="fas fa-book"></i></div>
      <div class="stat-info"><h4>Subjects</h4><p>${subjects.length}</p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon cyan"><i class="fas fa-file-alt"></i></div>
      <div class="stat-info"><h4>Results Computed</h4><p>${results.length}</p></div>
    </div>`;

  const sessionBox = document.getElementById('sessionInfoBox');
  sessionBox.innerHTML = `
    <div class="session-info-item"><span class="label">School Name</span><span class="value">${settings.schoolName || '—'}</span></div>
    <div class="session-info-item"><span class="label">Academic Session</span><span class="value">${settings.session || '—'}</span></div>
    <div class="session-info-item"><span class="label">Current Term</span><span class="value">${settings.term || '—'}</span></div>
    <div class="session-info-item"><span class="label">School Level</span><span class="value">${currentUser ? levelLabel(currentUser.level) : '—'} School</span></div>
    <div class="session-info-item"><span class="label">Grading System</span><span class="value">${settings.grading === 'percentage' ? 'Percentage (0–100)' : 'Letter Grade (A–F)'}</span></div>
    <div class="session-info-item"><span class="label">Logged in as</span><span class="value">${currentUser ? currentUser.name : '—'}</span></div>`;
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  seedDefaults();
  // show login
  document.getElementById('loginPage').classList.add('active');
});
