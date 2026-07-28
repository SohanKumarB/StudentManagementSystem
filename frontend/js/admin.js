/* =========================================================
   STUDENT MANAGEMENT SYSTEM - ADMIN DASHBOARD CONTROLLER
   ========================================================= */

let allStudents = [];
let allDepartments = [];
let allCourses = [];
let allTeachers = [];
let allTimetable = [];
let allAttendance = [];
let allMarks = [];
let allNotices = [];

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user || user.role !== 'ROLE_ADMIN') {
    console.warn("No active Admin session found. Initializing Admin Dashboard in Client Demo Mode.");
  }

  // Initialize Local Storage Default Data if empty
  initDefaultStorage();

  // Load all module data
  loadDepartments();
  loadCourses();
  loadTeachers();
  loadTimetable();
  loadStudents();
  loadAttendanceRecords();
  loadMarksRecords();
  loadNotices();
  loadDashboardStats();
  loadActivityLogs();
});

// Initialize LocalStorage Seeds
function initDefaultStorage() {
  if (!localStorage.getItem('sms_departments')) {
    const defaultDepts = [
      { id: 1, code: 'CSE', name: 'Computer Science & Engineering', headOfDepartment: 'Dr. Alan Turing', capacity: 120 },
      { id: 2, code: 'ECE', name: 'Electronics & Communication', headOfDepartment: 'Dr. Claude Shannon', capacity: 100 },
      { id: 3, code: 'MECH', name: 'Mechanical Engineering', headOfDepartment: 'Dr. Nikola Tesla', capacity: 80 },
      { id: 4, code: 'CIVIL', name: 'Civil Engineering', headOfDepartment: 'Dr. Isambard Brunel', capacity: 60 }
    ];
    localStorage.setItem('sms_departments', JSON.stringify(defaultDepts));
  }

  if (!localStorage.getItem('sms_courses')) {
    const defaultCourses = [
      { id: 1, code: 'CS501', title: 'Database Management Systems', credits: 4, departmentCode: 'CSE', semester: 5 },
      { id: 2, code: 'CS502', title: 'Web Development Technology', credits: 3, departmentCode: 'CSE', semester: 5 },
      { id: 3, code: 'CS503', title: 'Data Structures & Algorithms', credits: 4, departmentCode: 'CSE', semester: 3 },
      { id: 4, code: 'EC301', title: 'Digital Signal Processing', credits: 4, departmentCode: 'ECE', semester: 3 }
    ];
    localStorage.setItem('sms_courses', JSON.stringify(defaultCourses));
  }

  if (!localStorage.getItem('sms_teachers')) {
    const defaultTeachers = [
      { id: 1, empId: 'FAC-101', name: 'Prof. Sarah Connor', email: 'sarah.connor@university.edu', department: 'CSE', designation: 'Professor', phone: '+1 555-0199', assignedCourses: 'CS501, CS502' },
      { id: 2, empId: 'FAC-102', name: 'Dr. Robert Langdon', email: 'r.langdon@university.edu', department: 'ECE', designation: 'Associate Professor', phone: '+1 555-0188', assignedCourses: 'EC301' }
    ];
    localStorage.setItem('sms_teachers', JSON.stringify(defaultTeachers));
  }

  if (!localStorage.getItem('sms_timetable')) {
    const defaultTimetable = [
      { id: 1, dayOfWeek: 'Monday', timeSlot: '09:00 AM - 10:00 AM', courseCode: 'CS501', courseTitle: 'Database Systems', roomNumber: 'Lab 3B', department: 'CSE', semester: 5, section: 'A' },
      { id: 2, dayOfWeek: 'Monday', timeSlot: '10:15 AM - 11:15 AM', courseCode: 'CS502', courseTitle: 'Web Development', roomNumber: 'Hall 102', department: 'CSE', semester: 5, section: 'A' },
      { id: 3, dayOfWeek: 'Tuesday', timeSlot: '11:30 AM - 12:30 PM', courseCode: 'EC301', courseTitle: 'Digital Signal Processing', roomNumber: 'Room 204', department: 'ECE', semester: 3, section: 'B' }
    ];
    localStorage.setItem('sms_timetable', JSON.stringify(defaultTimetable));
  }

  if (!localStorage.getItem('sms_students')) {
    const defaultStudents = [
      { id: 1, usnRollNumber: '1CS21001', name: 'Alex Johnson', email: 'alex.johnson@student.edu', phone: '+1 555-0192', gender: 'Male', dateOfBirth: '2002-05-14', address: '742 Evergreen Terrace, Springfield', department: 'CSE', semester: 5, section: 'A', assignedCourses: 'CS501, CS502', parentName: 'Robert Johnson', parentPhone: '+1 555-0188' },
      { id: 2, usnRollNumber: '1EC21002', name: 'Sophia Williams', email: 'sophia.williams@student.edu', phone: '+1 555-0194', gender: 'Female', dateOfBirth: '2002-11-20', address: '123 Maple Street, Metroville', department: 'ECE', semester: 3, section: 'B', assignedCourses: 'EC301', parentName: 'David Williams', parentPhone: '+1 555-0199' },
      { id: 3, usnRollNumber: '1ME21003', name: 'Ethan Davis', email: 'ethan.davis@student.edu', phone: '+1 555-0197', gender: 'Male', dateOfBirth: '2001-03-10', address: '456 Oak Avenue, Riverdale', department: 'MECH', semester: 5, section: 'A', assignedCourses: 'ME501', parentName: 'Mark Davis', parentPhone: '+1 555-0177' }
    ];
    localStorage.setItem('sms_students', JSON.stringify(defaultStudents));
  }

  if (!localStorage.getItem('sms_attendance')) {
    const defaultAttendance = [
      { id: 1, studentId: 1, studentUsn: '1CS21001', courseCode: 'CS501', date: '2026-07-25', status: 'PRESENT', remarks: 'Regular' },
      { id: 2, studentId: 1, studentUsn: '1CS21001', courseCode: 'CS502', date: '2026-07-26', status: 'PRESENT', remarks: 'Regular' },
      { id: 3, studentId: 2, studentUsn: '1EC21002', courseCode: 'EC301', date: '2026-07-27', status: 'PRESENT', remarks: 'Regular' }
    ];
    localStorage.setItem('sms_attendance', JSON.stringify(defaultAttendance));
  }

  if (!localStorage.getItem('sms_marks')) {
    const defaultMarks = [
      { id: 1, studentId: 1, studentUsn: '1CS21001', courseCode: 'CS501', courseTitle: 'Database Management Systems', internalMarks: 18.5, assignmentMarks: 9.5, labMarks: 19.0, finalExamMarks: 45.0, totalMarks: 92.0, grade: 'A+', gpa: 4.0 },
      { id: 2, studentId: 1, studentUsn: '1CS21001', courseCode: 'CS502', courseTitle: 'Web Development Technology', internalMarks: 17.0, assignmentMarks: 9.0, labMarks: 18.0, finalExamMarks: 42.0, totalMarks: 86.0, grade: 'A', gpa: 3.7 },
      { id: 3, studentId: 2, studentUsn: '1EC21002', courseCode: 'EC301', courseTitle: 'Digital Signal Processing', internalMarks: 16.0, assignmentMarks: 8.5, labMarks: 17.5, finalExamMarks: 40.0, totalMarks: 82.0, grade: 'A', gpa: 3.7 }
    ];
    localStorage.setItem('sms_marks', JSON.stringify(defaultMarks));
  }

  if (!localStorage.getItem('sms_notices')) {
    const defaultNotices = [
      { id: 1, title: 'Mid-Semester Examination Timetable Released', category: 'Exams', date: '2026-07-25', content: 'The mid-semester examination timetable for all 3rd, 5th, and 7th semester students is published on the portal.' },
      { id: 2, title: 'Annual Campus Hackathon & Tech Fest 2026', category: 'Events', date: '2026-07-28', content: 'Registrations are open for the annual Campus Hackathon. Participate to showcase your coding skills and win prizes!' }
    ];
    localStorage.setItem('sms_notices', JSON.stringify(defaultNotices));
  }
}

// Populate Dynamic Dropdowns across forms
function populateDropdowns() {
  const depts = allDepartments.length > 0 ? allDepartments : JSON.parse(localStorage.getItem('sms_departments') || '[]');
  const courses = allCourses.length > 0 ? allCourses : JSON.parse(localStorage.getItem('sms_courses') || '[]');

  // Dept Dropdowns
  const deptSelects = ['filter-dept', 'student-dept', 'course-dept', 'teacher-dept', 'tt-dept'];
  deptSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const currentVal = el.value;
    let html = id === 'filter-dept' ? '<option value="">All Departments</option>' : '';
    depts.forEach(d => {
      html += `<option value="${d.code}">${d.code} - ${d.name}</option>`;
    });
    el.innerHTML = html;
    if (currentVal) el.value = currentVal;
  });

  // Course Dropdowns
  const attCourseSelect = document.getElementById('att-course');
  if (attCourseSelect) {
    let html = '';
    courses.forEach(c => {
      html += `<option value="${c.code}">${c.code} - ${c.title}</option>`;
    });
    attCourseSelect.innerHTML = html;
  }
}

// =========================================================
// 1. DASHBOARD ANALYTICS & STATS
// =========================================================
async function loadDashboardStats() {
  try {
    const response = await fetch(API.DASHBOARD_STATS, { headers: getAuthHeaders() });
    if (response.ok) {
      const stats = await response.json();
      updateStatCards(stats);
      initAdminCharts(stats);
    } else {
      updateStatCardsFallback();
    }
  } catch (err) {
    updateStatCardsFallback();
  }
}

function updateStatCards(stats) {
  document.getElementById('stat-total-students').innerText = stats.totalStudents || 0;
  document.getElementById('stat-attendance-pct').innerText = `${stats.overallAttendancePercentage || 0}%`;
  document.getElementById('stat-avg-gpa').innerText = stats.averageGpa || '0.00';
  document.getElementById('stat-total-depts').innerText = stats.departmentDistribution ? Object.keys(stats.departmentDistribution).length : allDepartments.length;
}

function updateStatCardsFallback() {
  const students = JSON.parse(localStorage.getItem('sms_students') || '[]');
  const depts = JSON.parse(localStorage.getItem('sms_departments') || '[]');
  const marks = JSON.parse(localStorage.getItem('sms_marks') || '[]');
  const attendance = JSON.parse(localStorage.getItem('sms_attendance') || '[]');

  let totalMale = students.filter(s => (s.gender || '').toLowerCase() === 'male').length;
  let totalFemale = students.filter(s => (s.gender || '').toLowerCase() === 'female').length;

  let totalGpa = marks.reduce((acc, m) => acc + (parseFloat(m.gpa) || 0), 0);
  let avgGpa = marks.length > 0 ? (totalGpa / marks.length).toFixed(2) : '3.75';

  let presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  let attPct = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : '94.2';

  let deptDist = {};
  depts.forEach(d => { deptDist[d.code] = 0; });
  students.forEach(s => {
    deptDist[s.department] = (deptDist[s.department] || 0) + 1;
  });

  const computedStats = {
    totalStudents: students.length,
    totalMale: totalMale,
    totalFemale: totalFemale,
    overallAttendancePercentage: attPct,
    averageGpa: avgGpa,
    departmentDistribution: deptDist
  };

  updateStatCards(computedStats);
  if (typeof initAdminCharts === 'function') {
    initAdminCharts(computedStats);
  }
}

// =========================================================
// 2. STUDENTS MANAGEMENT
// =========================================================
async function loadStudents() {
  showLoading();
  const searchInput = document.getElementById('search-query')?.value || '';
  const deptFilter = document.getElementById('filter-dept')?.value || '';
  const semFilter = document.getElementById('filter-sem')?.value || '';
  const secFilter = document.getElementById('filter-sec')?.value || '';

  let url = `${API.STUDENTS}?query=${encodeURIComponent(searchInput)}&department=${encodeURIComponent(deptFilter)}&section=${encodeURIComponent(secFilter)}`;
  if (semFilter) url += `&semester=${semFilter}`;

  try {
    const response = await fetch(url, { headers: getAuthHeaders() });
    hideLoading();
    if (response.ok) {
      allStudents = await response.json();
      renderStudentsTable(allStudents);
    } else {
      renderStudentsTableFallback();
    }
  } catch (err) {
    hideLoading();
    renderStudentsTableFallback();
  }
}

function renderStudentsTable(students) {
  const tbody = document.getElementById('students-tbody');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No student records found matching filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td><strong>${s.usnRollNumber}</strong></td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${s.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name) + '&background=random'}" class="user-avatar" alt="Photo">
          <div>
            <div class="fw-bold">${s.name}</div>
            <div class="text-muted small">${s.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-custom badge-role">${s.department || 'N/A'}</span></td>
      <td>Sem ${s.semester || '-'} (${s.section || '-'})</td>
      <td>${s.phone || 'N/A'}</td>
      <td>${s.assignedCourses || 'None'}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditStudentModal(${s.id})" title="Edit Student"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-success" onclick="openAttendanceModal(${s.id}, '${s.name}', '${s.usnRollNumber}')" title="Mark Attendance"><i class="bi bi-calendar-check"></i></button>
          <button class="btn btn-outline-warning" onclick="openMarksModal(${s.id}, '${s.name}', '${s.usnRollNumber}')" title="Enter Marks"><i class="bi bi-award-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteStudent(${s.id})" title="Delete Student"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderStudentsTableFallback() {
  let stored = JSON.parse(localStorage.getItem('sms_students') || '[]');
  const searchInput = (document.getElementById('search-query')?.value || '').toLowerCase();
  const deptFilter = document.getElementById('filter-dept')?.value || '';
  const semFilter = document.getElementById('filter-sem')?.value || '';
  const secFilter = document.getElementById('filter-sec')?.value || '';

  if (searchInput || deptFilter || semFilter || secFilter) {
    stored = stored.filter(s => {
      const matchQuery = !searchInput || s.name.toLowerCase().includes(searchInput) || s.usnRollNumber.toLowerCase().includes(searchInput) || s.email.toLowerCase().includes(searchInput);
      const matchDept = !deptFilter || s.department === deptFilter;
      const matchSem = !semFilter || String(s.semester) === String(semFilter);
      const matchSec = !secFilter || s.section === secFilter;
      return matchQuery && matchDept && matchSem && matchSec;
    });
  }

  allStudents = stored;
  renderStudentsTable(stored);
}

function openAddStudentModal() {
  populateDropdowns();
  document.getElementById('studentForm').reset();
  document.getElementById('student-id').value = '';
  document.getElementById('studentModalLabel').innerText = 'Add New Student';
  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

function openEditStudentModal(id) {
  populateDropdowns();
  const s = allStudents.find(item => item.id === id);
  if (!s) return;

  document.getElementById('student-id').value = s.id;
  document.getElementById('student-usn').value = s.usnRollNumber || '';
  document.getElementById('student-name').value = s.name || '';
  document.getElementById('student-email').value = s.email || '';
  document.getElementById('student-phone').value = s.phone || '';
  document.getElementById('student-gender').value = s.gender || 'Male';
  document.getElementById('student-dob').value = s.dateOfBirth || '';
  document.getElementById('student-dept').value = s.department || 'CSE';
  document.getElementById('student-sem').value = s.semester || 1;
  document.getElementById('student-sec').value = s.section || 'A';
  document.getElementById('student-address').value = s.address || '';
  document.getElementById('student-courses').value = s.assignedCourses || '';
  document.getElementById('student-parent-name').value = s.parentName || '';
  document.getElementById('student-parent-phone').value = s.parentPhone || '';

  document.getElementById('studentModalLabel').innerText = 'Edit Student Profile';
  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

async function handleSaveStudent(event) {
  event.preventDefault();
  const idStr = document.getElementById('student-id').value;

  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    usnRollNumber: document.getElementById('student-usn').value.trim(),
    name: document.getElementById('student-name').value.trim(),
    email: document.getElementById('student-email').value.trim(),
    phone: document.getElementById('student-phone').value.trim(),
    gender: document.getElementById('student-gender').value,
    dateOfBirth: document.getElementById('student-dob').value,
    department: document.getElementById('student-dept').value,
    semester: parseInt(document.getElementById('student-sem').value || 1),
    section: document.getElementById('student-sec').value,
    address: document.getElementById('student-address').value,
    assignedCourses: document.getElementById('student-courses').value,
    parentName: document.getElementById('student-parent-name').value,
    parentPhone: document.getElementById('student-parent-phone').value
  };

  showLoading();
  try {
    const url = idStr ? `${API.STUDENTS}/${idStr}` : API.STUDENTS;
    const method = idStr ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    hideLoading();
    if (response.ok) {
      showToast(`Student record ${idStr ? 'updated' : 'created'} successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
      loadStudents();
      loadDashboardStats();
    } else {
      saveStudentLocalStorage(payload, idStr);
    }
  } catch (err) {
    hideLoading();
    saveStudentLocalStorage(payload, idStr);
  }
}

function saveStudentLocalStorage(payload, idStr) {
  let stored = JSON.parse(localStorage.getItem('sms_students') || '[]');
  if (idStr) {
    stored = stored.map(s => s.id === parseInt(idStr) ? payload : s);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_students', JSON.stringify(stored));
  showToast(`Student record ${idStr ? 'updated' : 'created'} successfully!`, 'success');
  const modalEl = document.getElementById('studentModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  loadStudents();
  loadDashboardStats();
}

async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student record?')) return;

  showLoading();
  try {
    const response = await fetch(`${API.STUDENTS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    hideLoading();
    if (response.ok) {
      showToast('Student record deleted successfully!', 'success');
      loadStudents();
      loadDashboardStats();
    } else {
      deleteStudentLocalStorage(id);
    }
  } catch (err) {
    hideLoading();
    deleteStudentLocalStorage(id);
  }
}

function deleteStudentLocalStorage(id) {
  let stored = JSON.parse(localStorage.getItem('sms_students') || '[]');
  stored = stored.filter(s => s.id !== id);
  localStorage.setItem('sms_students', JSON.stringify(stored));
  showToast('Student record deleted successfully!', 'success');
  loadStudents();
  loadDashboardStats();
}

// =========================================================
// 3. DEPARTMENTS MANAGEMENT
// =========================================================
async function loadDepartments() {
  try {
    const response = await fetch(API.DEPARTMENTS, { headers: getAuthHeaders() });
    if (response.ok) {
      allDepartments = await response.json();
      renderDepartmentsTable(allDepartments);
    } else {
      renderDepartmentsFallback();
    }
  } catch (err) {
    renderDepartmentsFallback();
  }
}

function renderDepartmentsTable(depts) {
  const tbody = document.getElementById('departments-tbody');
  if (!tbody) return;
  if (depts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No department records available.</td></tr>`;
    return;
  }
  tbody.innerHTML = depts.map(d => `
    <tr>
      <td><strong>${d.code}</strong></td>
      <td>${d.name}</td>
      <td>${d.headOfDepartment || 'N/A'}</td>
      <td><span class="badge bg-secondary">${d.capacity || 100}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditDeptModal(${d.id})" title="Edit Department"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteDept(${d.id})" title="Delete Department"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  populateDropdowns();
}

function renderDepartmentsFallback() {
  allDepartments = JSON.parse(localStorage.getItem('sms_departments') || '[]');
  renderDepartmentsTable(allDepartments);
}

function openAddDeptModal() {
  document.getElementById('deptForm').reset();
  document.getElementById('dept-id').value = '';
  document.getElementById('deptModalLabel').innerText = 'Add New Department';
  new bootstrap.Modal(document.getElementById('deptModal')).show();
}

function openEditDeptModal(id) {
  const d = allDepartments.find(item => item.id === id);
  if (!d) return;

  document.getElementById('dept-id').value = d.id;
  document.getElementById('dept-code').value = d.code;
  document.getElementById('dept-name').value = d.name;
  document.getElementById('dept-hod').value = d.headOfDepartment || '';
  document.getElementById('dept-capacity').value = d.capacity || 100;

  document.getElementById('deptModalLabel').innerText = 'Edit Department';
  new bootstrap.Modal(document.getElementById('deptModal')).show();
}

async function handleSaveDept(event) {
  event.preventDefault();
  const idStr = document.getElementById('dept-id').value;
  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    code: document.getElementById('dept-code').value.trim().toUpperCase(),
    name: document.getElementById('dept-name').value.trim(),
    headOfDepartment: document.getElementById('dept-hod').value.trim(),
    capacity: parseInt(document.getElementById('dept-capacity').value || 100)
  };

  showLoading();
  try {
    const url = idStr ? `${API.DEPARTMENTS}/${idStr}` : API.DEPARTMENTS;
    const method = idStr ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
    hideLoading();
    if (response.ok) {
      showToast(`Department ${idStr ? 'updated' : 'created'} successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('deptModal')).hide();
      loadDepartments();
      loadDashboardStats();
    } else {
      saveDeptLocalStorage(payload, idStr);
    }
  } catch (err) {
    hideLoading();
    saveDeptLocalStorage(payload, idStr);
  }
}

function saveDeptLocalStorage(payload, idStr) {
  let stored = JSON.parse(localStorage.getItem('sms_departments') || '[]');
  if (idStr) {
    stored = stored.map(d => d.id === parseInt(idStr) ? payload : d);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_departments', JSON.stringify(stored));
  showToast(`Department ${idStr ? 'updated' : 'created'} successfully!`, 'success');
  bootstrap.Modal.getInstance(document.getElementById('deptModal')).hide();
  loadDepartments();
  loadDashboardStats();
}

async function deleteDept(id) {
  if (!confirm('Are you sure you want to delete this department?')) return;
  showLoading();
  try {
    const response = await fetch(`${API.DEPARTMENTS}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    hideLoading();
    if (response.ok) {
      showToast('Department deleted!', 'success');
      loadDepartments();
      loadDashboardStats();
    } else {
      deleteDeptLocalStorage(id);
    }
  } catch (err) {
    hideLoading();
    deleteDeptLocalStorage(id);
  }
}

function deleteDeptLocalStorage(id) {
  let stored = JSON.parse(localStorage.getItem('sms_departments') || '[]');
  stored = stored.filter(d => d.id !== id);
  localStorage.setItem('sms_departments', JSON.stringify(stored));
  showToast('Department deleted successfully!', 'success');
  loadDepartments();
  loadDashboardStats();
}

// =========================================================
// 4. COURSES MANAGEMENT
// =========================================================
async function loadCourses() {
  try {
    const response = await fetch(API.COURSES, { headers: getAuthHeaders() });
    if (response.ok) {
      allCourses = await response.json();
      renderCoursesTable(allCourses);
    } else {
      renderCoursesFallback();
    }
  } catch (err) {
    renderCoursesFallback();
  }
}

function renderCoursesTable(courses) {
  const tbody = document.getElementById('courses-tbody');
  if (!tbody) return;
  if (courses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No course records available.</td></tr>`;
    return;
  }
  tbody.innerHTML = courses.map(c => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td>${c.title}</td>
      <td>${c.credits || 4}</td>
      <td><span class="badge badge-custom badge-role">${c.departmentCode}</span></td>
      <td>Sem ${c.semester || 1}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditCourseModal(${c.id})" title="Edit Course"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteCourse(${c.id})" title="Delete Course"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  populateDropdowns();
}

function renderCoursesFallback() {
  allCourses = JSON.parse(localStorage.getItem('sms_courses') || '[]');
  renderCoursesTable(allCourses);
}

function openAddCourseModal() {
  populateDropdowns();
  document.getElementById('courseForm').reset();
  document.getElementById('course-id').value = '';
  document.getElementById('courseModalLabel').innerText = 'Add New Course';
  new bootstrap.Modal(document.getElementById('courseModal')).show();
}

function openEditCourseModal(id) {
  populateDropdowns();
  const c = allCourses.find(item => item.id === id);
  if (!c) return;

  document.getElementById('course-id').value = c.id;
  document.getElementById('course-code').value = c.code;
  document.getElementById('course-title').value = c.title;
  document.getElementById('course-credits').value = c.credits || 4;
  document.getElementById('course-dept').value = c.departmentCode || 'CSE';
  document.getElementById('course-sem').value = c.semester || 1;

  document.getElementById('courseModalLabel').innerText = 'Edit Course';
  new bootstrap.Modal(document.getElementById('courseModal')).show();
}

async function handleSaveCourse(event) {
  event.preventDefault();
  const idStr = document.getElementById('course-id').value;
  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    code: document.getElementById('course-code').value.trim().toUpperCase(),
    title: document.getElementById('course-title').value.trim(),
    credits: parseInt(document.getElementById('course-credits').value || 4),
    departmentCode: document.getElementById('course-dept').value,
    semester: parseInt(document.getElementById('course-sem').value || 1)
  };

  showLoading();
  try {
    const url = idStr ? `${API.COURSES}/${idStr}` : API.COURSES;
    const method = idStr ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
    hideLoading();
    if (response.ok) {
      showToast(`Course ${idStr ? 'updated' : 'created'} successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
      loadCourses();
    } else {
      saveCourseLocalStorage(payload, idStr);
    }
  } catch (err) {
    hideLoading();
    saveCourseLocalStorage(payload, idStr);
  }
}

function saveCourseLocalStorage(payload, idStr) {
  let stored = JSON.parse(localStorage.getItem('sms_courses') || '[]');
  if (idStr) {
    stored = stored.map(c => c.id === parseInt(idStr) ? payload : c);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_courses', JSON.stringify(stored));
  showToast(`Course ${idStr ? 'updated' : 'created'} successfully!`, 'success');
  bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
  loadCourses();
}

async function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return;
  showLoading();
  try {
    const response = await fetch(`${API.COURSES}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    hideLoading();
    if (response.ok) {
      showToast('Course deleted!', 'success');
      loadCourses();
    } else {
      deleteCourseLocalStorage(id);
    }
  } catch (err) {
    hideLoading();
    deleteCourseLocalStorage(id);
  }
}

function deleteCourseLocalStorage(id) {
  let stored = JSON.parse(localStorage.getItem('sms_courses') || '[]');
  stored = stored.filter(c => c.id !== id);
  localStorage.setItem('sms_courses', JSON.stringify(stored));
  showToast('Course deleted successfully!', 'success');
  loadCourses();
}

// =========================================================
// 5. TEACHERS / FACULTY MANAGEMENT
// =========================================================
async function loadTeachers() {
  try {
    const response = await fetch(API.TEACHERS, { headers: getAuthHeaders() });
    if (response.ok) {
      allTeachers = await response.json();
      renderTeachersTable(allTeachers);
    } else {
      renderTeachersFallback();
    }
  } catch (err) {
    renderTeachersFallback();
  }
}

function renderTeachersTable(teachers) {
  const tbody = document.getElementById('teachers-tbody');
  if (!tbody) return;
  if (teachers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No faculty members found.</td></tr>`;
    return;
  }
  tbody.innerHTML = teachers.map(t => `
    <tr>
      <td><strong>${t.empId}</strong></td>
      <td>
        <div class="fw-bold">${t.name}</div>
        <div class="text-muted small">${t.email}</div>
      </td>
      <td><span class="badge badge-custom badge-role">${t.department}</span></td>
      <td>${t.designation || 'Lecturer'}</td>
      <td>${t.phone || 'N/A'}</td>
      <td>${t.assignedCourses || 'None'}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditTeacherModal(${t.id})" title="Edit Teacher"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteTeacher(${t.id})" title="Delete Teacher"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderTeachersFallback() {
  allTeachers = JSON.parse(localStorage.getItem('sms_teachers') || '[]');
  renderTeachersTable(allTeachers);
}

function openAddTeacherModal() {
  populateDropdowns();
  document.getElementById('teacherForm').reset();
  document.getElementById('teacher-id').value = '';
  document.getElementById('teacherModalLabel').innerText = 'Add New Teacher / Faculty';
  new bootstrap.Modal(document.getElementById('teacherModal')).show();
}

function openEditTeacherModal(id) {
  populateDropdowns();
  const t = allTeachers.find(item => item.id === id);
  if (!t) return;

  document.getElementById('teacher-id').value = t.id;
  document.getElementById('teacher-emp-id').value = t.empId;
  document.getElementById('teacher-name').value = t.name;
  document.getElementById('teacher-email').value = t.email;
  document.getElementById('teacher-phone').value = t.phone || '';
  document.getElementById('teacher-dept').value = t.department || 'CSE';
  document.getElementById('teacher-designation').value = t.designation || '';
  document.getElementById('teacher-courses').value = t.assignedCourses || '';

  document.getElementById('teacherModalLabel').innerText = 'Edit Faculty Profile';
  new bootstrap.Modal(document.getElementById('teacherModal')).show();
}

async function handleSaveTeacher(event) {
  event.preventDefault();
  const idStr = document.getElementById('teacher-id').value;
  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    empId: document.getElementById('teacher-emp-id').value.trim(),
    name: document.getElementById('teacher-name').value.trim(),
    email: document.getElementById('teacher-email').value.trim(),
    phone: document.getElementById('teacher-phone').value.trim(),
    department: document.getElementById('teacher-dept').value,
    designation: document.getElementById('teacher-designation').value.trim(),
    assignedCourses: document.getElementById('teacher-courses').value.trim()
  };

  showLoading();
  try {
    const url = idStr ? `${API.TEACHERS}/${idStr}` : API.TEACHERS;
    const method = idStr ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
    hideLoading();
    if (response.ok) {
      showToast(`Faculty record ${idStr ? 'updated' : 'created'} successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
      loadTeachers();
    } else {
      saveTeacherLocalStorage(payload, idStr);
    }
  } catch (err) {
    hideLoading();
    saveTeacherLocalStorage(payload, idStr);
  }
}

function saveTeacherLocalStorage(payload, idStr) {
  let stored = JSON.parse(localStorage.getItem('sms_teachers') || '[]');
  if (idStr) {
    stored = stored.map(t => t.id === parseInt(idStr) ? payload : t);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_teachers', JSON.stringify(stored));
  showToast(`Faculty record ${idStr ? 'updated' : 'created'} successfully!`, 'success');
  bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
  loadTeachers();
}

async function deleteTeacher(id) {
  if (!confirm('Are you sure you want to delete this faculty record?')) return;
  showLoading();
  try {
    const response = await fetch(`${API.TEACHERS}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    hideLoading();
    if (response.ok) {
      showToast('Faculty record deleted!', 'success');
      loadTeachers();
    } else {
      deleteTeacherLocalStorage(id);
    }
  } catch (err) {
    hideLoading();
    deleteTeacherLocalStorage(id);
  }
}

function deleteTeacherLocalStorage(id) {
  let stored = JSON.parse(localStorage.getItem('sms_teachers') || '[]');
  stored = stored.filter(t => t.id !== id);
  localStorage.setItem('sms_teachers', JSON.stringify(stored));
  showToast('Faculty record deleted!', 'success');
  loadTeachers();
}

// =========================================================
// 6. TIMETABLE SCHEDULE MANAGEMENT
// =========================================================
async function loadTimetable() {
  try {
    const response = await fetch(API.TIMETABLE_ADMIN, { headers: getAuthHeaders() });
    if (response.ok) {
      allTimetable = await response.json();
      renderTimetableTable(allTimetable);
    } else {
      renderTimetableFallback();
    }
  } catch (err) {
    renderTimetableFallback();
  }
}

function renderTimetableTable(timetable) {
  const tbody = document.getElementById('timetable-tbody');
  if (!tbody) return;
  if (timetable.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No timetable schedule slots configured.</td></tr>`;
    return;
  }
  tbody.innerHTML = timetable.map(t => `
    <tr>
      <td><strong>${t.dayOfWeek}</strong></td>
      <td>${t.timeSlot}</td>
      <td><div><strong>${t.courseCode}</strong></div><small class="text-muted">${t.courseTitle || ''}</small></td>
      <td><span class="badge bg-info text-dark">${t.roomNumber || 'TBA'}</span></td>
      <td><span class="badge badge-custom badge-role">${t.department}</span></td>
      <td>Sem ${t.semester || 1} (${t.section || 'A'})</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="openEditTimetableModal(${t.id})" title="Edit Slot"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-outline-danger" onclick="deleteTimetable(${t.id})" title="Delete Slot"><i class="bi bi-trash-fill"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  populateDropdowns();
}

function renderTimetableFallback() {
  allTimetable = JSON.parse(localStorage.getItem('sms_timetable') || '[]');
  renderTimetableTable(allTimetable);
}

function openAddTimetableModal() {
  populateDropdowns();
  document.getElementById('timetableForm').reset();
  document.getElementById('tt-id').value = '';
  document.getElementById('timetableModalLabel').innerText = 'Add Timetable Schedule Slot';
  new bootstrap.Modal(document.getElementById('timetableModal')).show();
}

function openEditTimetableModal(id) {
  populateDropdowns();
  const t = allTimetable.find(item => item.id === id);
  if (!t) return;

  document.getElementById('tt-id').value = t.id;
  document.getElementById('tt-day').value = t.dayOfWeek || 'Monday';
  document.getElementById('tt-timeslot').value = t.timeSlot || '';
  document.getElementById('tt-course-code').value = t.courseCode || '';
  document.getElementById('tt-course-title').value = t.courseTitle || '';
  document.getElementById('tt-room').value = t.roomNumber || '';
  document.getElementById('tt-dept').value = t.department || 'CSE';
  document.getElementById('tt-sem').value = t.semester || 1;
  document.getElementById('tt-sec').value = t.section || 'A';

  document.getElementById('timetableModalLabel').innerText = 'Edit Schedule Slot';
  new bootstrap.Modal(document.getElementById('timetableModal')).show();
}

async function handleSaveTimetable(event) {
  event.preventDefault();
  const idStr = document.getElementById('tt-id').value;
  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    dayOfWeek: document.getElementById('tt-day').value,
    timeSlot: document.getElementById('tt-timeslot').value.trim(),
    courseCode: document.getElementById('tt-course-code').value.trim().toUpperCase(),
    courseTitle: document.getElementById('tt-course-title').value.trim(),
    roomNumber: document.getElementById('tt-room').value.trim(),
    department: document.getElementById('tt-dept').value,
    semester: parseInt(document.getElementById('tt-sem').value || 1),
    section: document.getElementById('tt-sec').value.trim().toUpperCase()
  };

  showLoading();
  try {
    const url = idStr ? `${API.TIMETABLE_ADMIN}/${idStr}` : API.TIMETABLE_ADMIN;
    const method = idStr ? 'PUT' : 'POST';
    const response = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
    hideLoading();
    if (response.ok) {
      showToast(`Timetable slot ${idStr ? 'updated' : 'created'} successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('timetableModal')).hide();
      loadTimetable();
    } else {
      saveTimetableLocalStorage(payload, idStr);
    }
  } catch (err) {
    hideLoading();
    saveTimetableLocalStorage(payload, idStr);
  }
}

function saveTimetableLocalStorage(payload, idStr) {
  let stored = JSON.parse(localStorage.getItem('sms_timetable') || '[]');
  if (idStr) {
    stored = stored.map(t => t.id === parseInt(idStr) ? payload : t);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_timetable', JSON.stringify(stored));
  showToast(`Timetable slot ${idStr ? 'updated' : 'created'} successfully!`, 'success');
  bootstrap.Modal.getInstance(document.getElementById('timetableModal')).hide();
  loadTimetable();
}

async function deleteTimetable(id) {
  if (!confirm('Are you sure you want to delete this schedule slot?')) return;
  showLoading();
  try {
    const response = await fetch(`${API.TIMETABLE_ADMIN}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    hideLoading();
    if (response.ok) {
      showToast('Timetable slot deleted!', 'success');
      loadTimetable();
    } else {
      deleteTimetableLocalStorage(id);
    }
  } catch (err) {
    hideLoading();
    deleteTimetableLocalStorage(id);
  }
}

function deleteTimetableLocalStorage(id) {
  let stored = JSON.parse(localStorage.getItem('sms_timetable') || '[]');
  stored = stored.filter(t => t.id !== id);
  localStorage.setItem('sms_timetable', JSON.stringify(stored));
  showToast('Timetable slot deleted successfully!', 'success');
  loadTimetable();
}

// =========================================================
// 7. ATTENDANCE & MARKS LOGS
// =========================================================
function openAttendanceModal(studentId, name, usn) {
  populateDropdowns();
  document.getElementById('att-student-id').value = studentId;
  document.getElementById('att-student-name').innerText = `${name} (${usn || ''})`;
  document.getElementById('att-date').valueAsDate = new Date();
  new bootstrap.Modal(document.getElementById('attendanceModal')).show();
}

async function handleSaveAttendance(event) {
  event.preventDefault();
  const studentId = document.getElementById('att-student-id').value;
  const s = allStudents.find(item => String(item.id) === String(studentId));
  const payload = {
    id: Date.now(),
    studentId: studentId,
    studentUsn: s ? s.usnRollNumber : '1CS21001',
    courseCode: document.getElementById('att-course').value,
    date: document.getElementById('att-date').value,
    status: document.getElementById('att-status').value,
    remarks: document.getElementById('att-remarks').value
  };

  showLoading();
  try {
    const response = await fetch(API.ATTENDANCE_ADMIN, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    hideLoading();
    if (response.ok) {
      showToast('Attendance recorded successfully!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('attendanceModal')).hide();
      loadAttendanceRecords();
      loadDashboardStats();
    } else {
      saveAttendanceLocalStorage(payload);
    }
  } catch (err) {
    hideLoading();
    saveAttendanceLocalStorage(payload);
  }
}

function saveAttendanceLocalStorage(payload) {
  let stored = JSON.parse(localStorage.getItem('sms_attendance') || '[]');
  stored.push(payload);
  localStorage.setItem('sms_attendance', JSON.stringify(stored));
  showToast('Attendance recorded successfully!', 'success');
  bootstrap.Modal.getInstance(document.getElementById('attendanceModal')).hide();
  loadAttendanceRecords();
  loadDashboardStats();
}

function loadAttendanceRecords() {
  allAttendance = JSON.parse(localStorage.getItem('sms_attendance') || '[]');
  const tbody = document.getElementById('attendance-tbody');
  if (!tbody) return;

  if (allAttendance.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No attendance logs available.</td></tr>`;
    return;
  }

  tbody.innerHTML = allAttendance.map(a => `
    <tr>
      <td><strong>${a.studentUsn || a.studentId}</strong></td>
      <td>${a.courseCode}</td>
      <td>${a.date}</td>
      <td><span class="badge ${a.status === 'PRESENT' ? 'bg-success' : 'bg-danger'}">${a.status}</span></td>
      <td>${a.remarks || '-'}</td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="deleteAttendance(${a.id})" title="Delete"><i class="bi bi-trash-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function deleteAttendance(id) {
  let stored = JSON.parse(localStorage.getItem('sms_attendance') || '[]');
  stored = stored.filter(a => a.id !== id);
  localStorage.setItem('sms_attendance', JSON.stringify(stored));
  showToast('Attendance record deleted!', 'success');
  loadAttendanceRecords();
  loadDashboardStats();
}

// Marks Management
function openMarksModal(studentId, name, usn) {
  document.getElementById('marks-student-id').value = studentId;
  document.getElementById('marks-student-name').innerText = `${name} (${usn || ''})`;
  new bootstrap.Modal(document.getElementById('marksModal')).show();
}

async function handleSaveMarks(event) {
  event.preventDefault();
  const studentId = document.getElementById('marks-student-id').value;
  const s = allStudents.find(item => String(item.id) === String(studentId));
  const internal = parseFloat(document.getElementById('marks-internal').value || 0);
  const assignment = parseFloat(document.getElementById('marks-assignment').value || 0);
  const lab = parseFloat(document.getElementById('marks-lab').value || 0);
  const finalExam = parseFloat(document.getElementById('marks-final').value || 0);
  const total = internal + assignment + lab + finalExam;

  let grade = 'F';
  let gpa = 0.0;
  if (total >= 90) { grade = 'A+'; gpa = 4.0; }
  else if (total >= 80) { grade = 'A'; gpa = 3.7; }
  else if (total >= 70) { grade = 'B'; gpa = 3.0; }
  else if (total >= 60) { grade = 'C'; gpa = 2.5; }
  else if (total >= 50) { grade = 'D'; gpa = 2.0; }

  const payload = {
    id: Date.now(),
    studentId: studentId,
    studentUsn: s ? s.usnRollNumber : '1CS21001',
    courseCode: document.getElementById('marks-course-code').value.trim().toUpperCase(),
    courseTitle: document.getElementById('marks-course-title').value.trim(),
    internalMarks: internal,
    assignmentMarks: assignment,
    labMarks: lab,
    finalExamMarks: finalExam,
    totalMarks: total,
    grade: grade,
    gpa: gpa
  };

  showLoading();
  try {
    const response = await fetch(API.MARKS_ADMIN, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    hideLoading();
    if (response.ok) {
      showToast('Marks & Grade saved successfully!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('marksModal')).hide();
      loadMarksRecords();
      loadDashboardStats();
    } else {
      saveMarksLocalStorage(payload);
    }
  } catch (err) {
    hideLoading();
    saveMarksLocalStorage(payload);
  }
}

function saveMarksLocalStorage(payload) {
  let stored = JSON.parse(localStorage.getItem('sms_marks') || '[]');
  stored.push(payload);
  localStorage.setItem('sms_marks', JSON.stringify(stored));
  showToast('Marks & GPA updated successfully!', 'success');
  bootstrap.Modal.getInstance(document.getElementById('marksModal')).hide();
  loadMarksRecords();
  loadDashboardStats();
}

function loadMarksRecords() {
  allMarks = JSON.parse(localStorage.getItem('sms_marks') || '[]');
  const tbody = document.getElementById('marks-tbody');
  if (!tbody) return;

  if (allMarks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No grade records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = allMarks.map(m => `
    <tr>
      <td><strong>${m.studentUsn || m.studentId}</strong></td>
      <td><div><strong>${m.courseCode}</strong></div><small class="text-muted">${m.courseTitle || ''}</small></td>
      <td>${m.internalMarks || 0}</td>
      <td>${m.assignmentMarks || 0}</td>
      <td>${m.labMarks || 0}</td>
      <td>${m.finalExamMarks || 0}</td>
      <td><strong>${m.totalMarks || 0}</strong></td>
      <td><span class="badge bg-primary">${m.grade || 'A'} (${m.gpa || 4.0})</span></td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="deleteMarks(${m.id})" title="Delete"><i class="bi bi-trash-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function deleteMarks(id) {
  let stored = JSON.parse(localStorage.getItem('sms_marks') || '[]');
  stored = stored.filter(m => m.id !== id);
  localStorage.setItem('sms_marks', JSON.stringify(stored));
  showToast('Marks record deleted!', 'success');
  loadMarksRecords();
  loadDashboardStats();
}

// =========================================================
// 8. CAMPUS NOTICES & ANNOUNCEMENTS
// =========================================================
function loadNotices() {
  allNotices = JSON.parse(localStorage.getItem('sms_notices') || '[]');
  const container = document.getElementById('notices-container');
  if (!container) return;

  if (allNotices.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-4 text-muted">No announcements posted yet.</div>`;
    return;
  }

  container.innerHTML = allNotices.map(n => `
    <div class="col-md-6">
      <div class="glass-card p-3 h-100 position-relative">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="badge bg-warning text-dark fw-bold">${n.category || 'General'}</span>
          <small class="text-muted"><i class="bi bi-calendar-event me-1"></i>${n.date}</small>
        </div>
        <h5 class="fw-bold mb-2">${n.title}</h5>
        <p class="text-muted small mb-3">${n.content}</p>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-outline-primary btn-sm" onclick="openEditNoticeModal(${n.id})"><i class="bi bi-pencil-fill"></i> Edit</button>
          <button class="btn btn-outline-danger btn-sm" onclick="deleteNotice(${n.id})"><i class="bi bi-trash-fill"></i> Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openAddNoticeModal() {
  document.getElementById('noticeForm').reset();
  document.getElementById('notice-id').value = '';
  document.getElementById('noticeModalLabel').innerText = 'Post Campus Notice';
  new bootstrap.Modal(document.getElementById('noticeModal')).show();
}

function openEditNoticeModal(id) {
  const n = allNotices.find(item => item.id === id);
  if (!n) return;

  document.getElementById('notice-id').value = n.id;
  document.getElementById('notice-title').value = n.title;
  document.getElementById('notice-category').value = n.category || 'Academic';
  document.getElementById('notice-content').value = n.content || '';

  document.getElementById('noticeModalLabel').innerText = 'Edit Campus Notice';
  new bootstrap.Modal(document.getElementById('noticeModal')).show();
}

function handleSaveNotice(event) {
  event.preventDefault();
  const idStr = document.getElementById('notice-id').value;
  const payload = {
    id: idStr ? parseInt(idStr) : Date.now(),
    title: document.getElementById('notice-title').value.trim(),
    category: document.getElementById('notice-category').value,
    date: new Date().toISOString().split('T')[0],
    content: document.getElementById('notice-content').value.trim()
  };

  let stored = JSON.parse(localStorage.getItem('sms_notices') || '[]');
  if (idStr) {
    stored = stored.map(n => n.id === parseInt(idStr) ? payload : n);
  } else {
    stored.push(payload);
  }
  localStorage.setItem('sms_notices', JSON.stringify(stored));
  showToast('Notice published successfully!', 'success');
  bootstrap.Modal.getInstance(document.getElementById('noticeModal')).hide();
  loadNotices();
}

function deleteNotice(id) {
  if (!confirm('Are you sure you want to delete this notice?')) return;
  let stored = JSON.parse(localStorage.getItem('sms_notices') || '[]');
  stored = stored.filter(n => n.id !== id);
  localStorage.setItem('sms_notices', JSON.stringify(stored));
  showToast('Notice removed successfully!', 'success');
  loadNotices();
}

// =========================================================
// 9. ACTIVITY LOGS
// =========================================================
async function loadActivityLogs() {
  try {
    const response = await fetch(API.ACTIVITY_LOGS, { headers: getAuthHeaders() });
    if (response.ok) {
      const logs = await response.json();
      renderActivityLogs(logs);
    }
  } catch (err) {
    renderActivityLogs([
      { username: 'admin', action: 'USER_LOGIN', details: 'Successful admin authentication session', timestamp: new Date().toISOString() },
      { username: 'admin', action: 'UPDATE_DATABASE', details: 'Configured department & timetable modules', timestamp: new Date().toISOString() }
    ]);
  }
}

function renderActivityLogs(logs) {
  const container = document.getElementById('activity-logs-container');
  if (!container) return;

  container.innerHTML = logs.map(l => `
    <div class="d-flex align-items-center justify-content-between p-2 border-bottom">
      <div>
        <span class="badge bg-primary me-2">${l.action}</span>
        <strong>${l.username}</strong>: ${l.details}
      </div>
      <small class="text-muted">${new Date(l.timestamp).toLocaleTimeString()}</small>
    </div>
  `).join('');
}
