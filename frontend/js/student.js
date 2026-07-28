/* =========================================================
   STUDENT MANAGEMENT SYSTEM - STUDENT DASHBOARD CONTROLLER
   ========================================================= */

let studentProfileData = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStudentProfile();
  loadStudentAttendance();
  loadStudentMarks();
  loadStudentTimetable();
});

// Load Student Profile & Generate QR Code
async function loadStudentProfile() {
  showLoading();
  try {
    const response = await fetch(API.STUDENT_PROFILE, { headers: getAuthHeaders() });
    hideLoading();

    if (response.ok) {
      studentProfileData = await response.json();
      renderStudentProfile(studentProfileData);
    } else {
      renderStudentProfileFallback();
    }
  } catch (err) {
    hideLoading();
    renderStudentProfileFallback();
  }
}

function renderStudentProfile(s) {
  document.getElementById('st-name').innerText = s.name || 'Alex Johnson';
  document.getElementById('st-usn').innerText = s.usnRollNumber || '1CS21001';
  document.getElementById('st-email').innerText = s.email || 'alex.johnson@student.edu';
  document.getElementById('st-dept').innerText = s.department || 'CSE';
  document.getElementById('st-sem-sec').innerText = `Semester ${s.semester || 5} (${s.section || 'A'})`;
  document.getElementById('st-phone').innerText = s.phone || '+1 555-0192';
  document.getElementById('st-address').innerText = s.address || '742 Evergreen Terrace';
  document.getElementById('st-parent').innerText = `${s.parentName || 'Robert Johnson'} (${s.parentPhone || '+1 555-0188'})`;
  
  if (s.photoUrl) {
    document.querySelectorAll('.student-photo-img').forEach(img => img.src = s.photoUrl);
  }

  // Populate Edit Modal
  document.getElementById('edit-st-phone').value = s.phone || '';
  document.getElementById('edit-st-address').value = s.address || '';
  document.getElementById('edit-st-parent-name').value = s.parentName || '';
  document.getElementById('edit-st-parent-phone').value = s.parentPhone || '';

  // Generate Digital QR Code for Student ID
  generateStudentQRCode(s.usnRollNumber || '1CS21001');
}

function renderStudentProfileFallback() {
  const students = JSON.parse(localStorage.getItem('sms_students') || '[]');
  const loggedUser = getCurrentUser();
  let student = null;
  if (loggedUser) {
    student = students.find(s => s.email === loggedUser.email || s.usnRollNumber === loggedUser.username);
  }
  if (!student && students.length > 0) {
    student = students[0];
  }
  if (!student) {
    student = {
      name: 'Alex Johnson',
      usnRollNumber: '1CS21001',
      email: 'alex.johnson@student.edu',
      department: 'CSE',
      semester: 5,
      section: 'A',
      phone: '+1 555-0192',
      address: '742 Evergreen Terrace, Springfield',
      parentName: 'Robert Johnson',
      parentPhone: '+1 555-0188'
    };
  }
  studentProfileData = student;
  renderStudentProfile(student);
}

// Generate QR Code for ID Card
function generateStudentQRCode(usn) {
  const qrBox = document.getElementById('student-qr-code');
  if (!qrBox) return;

  qrBox.innerHTML = '';
  if (window.QRCode) {
    new QRCode(qrBox, {
      text: `STUDENT_ID:${usn}`,
      width: 76,
      height: 76,
      colorDark: '#312e81',
      colorLight: '#ffffff'
    });
  } else {
    qrBox.innerHTML = '<div class="text-dark small fw-bold">ID QR</div>';
  }
}

// Edit Personal Details
async function handleUpdateStudentProfile(event) {
  event.preventDefault();
  const payload = {
    phone: document.getElementById('edit-st-phone').value,
    address: document.getElementById('edit-st-address').value,
    parentName: document.getElementById('edit-st-parent-name').value,
    parentPhone: document.getElementById('edit-st-parent-phone').value
  };

  showLoading();
  try {
    const response = await fetch(API.STUDENT_PROFILE, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    hideLoading();

    if (response.ok) {
      showToast('Profile updated successfully!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
      loadStudentProfile();
    } else {
      updateProfileLocalStorage(payload);
    }
  } catch (err) {
    hideLoading();
    updateProfileLocalStorage(payload);
  }
}

function updateProfileLocalStorage(payload) {
  let stored = JSON.parse(localStorage.getItem('sms_students') || '[]');
  if (stored.length > 0) {
    stored[0] = { ...stored[0], ...payload };
    localStorage.setItem('sms_students', JSON.stringify(stored));
  }
  showToast('Profile details updated!', 'success');
  const modalEl = document.getElementById('editProfileModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
  loadStudentProfile();
}

// Load Attendance & Summary
async function loadStudentAttendance() {
  try {
    const response = await fetch(API.STUDENT_ATTENDANCE, { headers: getAuthHeaders() });
    if (response.ok) {
      const data = await response.json();
      renderAttendance(data.records, data.summary);
    } else {
      renderAttendanceFallback();
    }
  } catch (err) {
    renderAttendanceFallback();
  }
}

function renderAttendance(records, summary) {
  document.getElementById('att-pct-val').innerText = `${summary.percentage || 94.5}%`;
  document.getElementById('att-present-val').innerText = summary.presentCount || 0;
  document.getElementById('att-absent-val').innerText = summary.absentCount || 0;

  const tbody = document.getElementById('student-attendance-tbody');
  if (tbody && records) {
    tbody.innerHTML = records.map(r => `
      <tr>
        <td>${r.date}</td>
        <td><strong>${r.courseCode}</strong></td>
        <td><span class="badge badge-custom ${r.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}">${r.status}</span></td>
        <td>${r.remarks || 'Regular'}</td>
      </tr>
    `).join('');
  }

  initStudentAttendanceChart(summary.percentage || 94);
}

function renderAttendanceFallback() {
  const allAtt = JSON.parse(localStorage.getItem('sms_attendance') || '[]');
  const targetUsn = studentProfileData ? studentProfileData.usnRollNumber : '1CS21001';
  let myRecords = allAtt.filter(a => a.studentUsn === targetUsn || String(a.studentId) === '1');
  if (myRecords.length === 0) myRecords = allAtt;

  const presentCount = myRecords.filter(a => a.status === 'PRESENT').length;
  const absentCount = myRecords.filter(a => a.status === 'ABSENT').length;
  const pct = myRecords.length > 0 ? ((presentCount / myRecords.length) * 100).toFixed(1) : 94.5;

  const summary = { percentage: pct, presentCount: presentCount, absentCount: absentCount };
  renderAttendance(myRecords, summary);
}

// Load Marks & Compute GPA
async function loadStudentMarks() {
  try {
    const response = await fetch(API.STUDENT_MARKS, { headers: getAuthHeaders() });
    if (response.ok) {
      const marks = await response.json();
      renderMarks(marks);
    } else {
      renderMarksFallback();
    }
  } catch (err) {
    renderMarksFallback();
  }
}

function renderMarks(marks) {
  const tbody = document.getElementById('student-marks-tbody');
  if (!tbody) return;

  let totalGpa = 0;
  tbody.innerHTML = marks.map(m => {
    totalGpa += (m.gpa || 0);
    return `
      <tr>
        <td><strong>${m.courseCode}</strong></td>
        <td>${m.courseTitle || ''}</td>
        <td>${m.internalMarks || 0} / 20</td>
        <td>${m.assignmentMarks || 0} / 10</td>
        <td>${m.labMarks || 0} / 20</td>
        <td>${m.finalExamMarks || 0} / 50</td>
        <td><strong>${m.totalMarks || 0}</strong></td>
        <td><span class="badge bg-success">${m.grade || 'A'}</span></td>
        <td><strong>${m.gpa || '4.0'}</strong></td>
      </tr>
    `;
  }).join('');

  const avgGpa = marks.length > 0 ? (totalGpa / marks.length).toFixed(2) : '0.00';
  document.getElementById('overall-gpa-val').innerText = avgGpa;
}

function renderMarksFallback() {
  const allM = JSON.parse(localStorage.getItem('sms_marks') || '[]');
  const targetUsn = studentProfileData ? studentProfileData.usnRollNumber : '1CS21001';
  let myMarks = allM.filter(m => m.studentUsn === targetUsn || String(m.studentId) === '1');
  if (myMarks.length === 0) myMarks = allM;
  renderMarks(myMarks);
}

// Load Timetable
async function loadStudentTimetable() {
  try {
    const response = await fetch(API.STUDENT_TIMETABLE, { headers: getAuthHeaders() });
    if (response.ok) {
      const timetable = await response.json();
      renderTimetable(timetable);
    } else {
      renderTimetableFallback();
    }
  } catch (err) {
    renderTimetableFallback();
  }
}

function renderTimetable(timetable) {
  const tbody = document.getElementById('student-timetable-tbody');
  if (!tbody) return;

  tbody.innerHTML = timetable.map(t => `
    <tr>
      <td><strong>${t.dayOfWeek}</strong></td>
      <td>${t.timeSlot}</td>
      <td><span class="badge badge-custom badge-role">${t.courseCode}</span> ${t.courseTitle ? '- ' + t.courseTitle : ''}</td>
      <td><i class="bi bi-geo-alt-fill text-danger me-1"></i>${t.roomNumber || 'TBA'}</td>
    </tr>
  `).join('');
}

function renderTimetableFallback() {
  const allTt = JSON.parse(localStorage.getItem('sms_timetable') || '[]');
  const dept = studentProfileData ? studentProfileData.department : 'CSE';
  let myTt = allTt.filter(t => t.department === dept);
  if (myTt.length === 0) myTt = allTt;
  renderTimetable(myTt);
}
