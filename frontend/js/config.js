/* =========================================================
   STUDENT MANAGEMENT SYSTEM - CONFIG & API ENDPOINTS
   ========================================================= */

const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api',
  TOKEN_KEY: 'sms_jwt_token',
  USER_KEY: 'sms_user_data'
};

const API = {
  // Auth
  LOGIN: `${CONFIG.API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${CONFIG.API_BASE_URL}/auth/forgot-password`,
  CHANGE_PASSWORD: `${CONFIG.API_BASE_URL}/auth/change-password`,

  // Admin
  STUDENTS: `${CONFIG.API_BASE_URL}/admin/students`,
  ATTENDANCE_ADMIN: `${CONFIG.API_BASE_URL}/admin/attendance`,
  MARKS_ADMIN: `${CONFIG.API_BASE_URL}/admin/marks`,
  DASHBOARD_STATS: `${CONFIG.API_BASE_URL}/admin/dashboard/stats`,
  DEPARTMENTS: `${CONFIG.API_BASE_URL}/admin/departments`,
  COURSES: `${CONFIG.API_BASE_URL}/admin/courses`,
  TIMETABLE_ADMIN: `${CONFIG.API_BASE_URL}/admin/timetable`,
  TEACHERS: `${CONFIG.API_BASE_URL}/admin/teachers`,
  NOTICES: `${CONFIG.API_BASE_URL}/admin/notices`,
  ACTIVITY_LOGS: `${CONFIG.API_BASE_URL}/admin/activity-logs`,

  // Student
  STUDENT_PROFILE: `${CONFIG.API_BASE_URL}/student/profile`,
  STUDENT_ATTENDANCE: `${CONFIG.API_BASE_URL}/student/attendance`,
  STUDENT_MARKS: `${CONFIG.API_BASE_URL}/student/marks`,
  STUDENT_TIMETABLE: `${CONFIG.API_BASE_URL}/student/timetable`
};

// Authentication Headers Helper
function getAuthHeaders() {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

function getCurrentUser() {
  const user = localStorage.getItem(CONFIG.USER_KEY);
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem(CONFIG.TOKEN_KEY);
  localStorage.removeItem(CONFIG.USER_KEY);
  window.location.href = 'index.html';
}
