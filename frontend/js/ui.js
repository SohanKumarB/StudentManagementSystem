/* =========================================================
   STUDENT MANAGEMENT SYSTEM - UI HELPERS & THEME CONTROLLER
   ========================================================= */

// Theme Management
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('sms_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
});

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('sms_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  });
}

// Toast Notification System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  
  let iconClass = 'bi-info-circle-fill';
  if (type === 'success') iconClass = 'bi-check-circle-fill';
  if (type === 'error') iconClass = 'bi-exclamation-triangle-fill';
  if (type === 'warning') iconClass = 'bi-exclamation-circle-fill';

  toast.innerHTML = `<i class="bi ${iconClass} fs-5"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Loading Spinner Overlay
function showLoading() {
  let overlay = document.getElementById('spinner-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'spinner-overlay';
    overlay.className = 'spinner-overlay';
    overlay.innerHTML = '<div class="spinner-glow"></div>';
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
}

function hideLoading() {
  const overlay = document.getElementById('spinner-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}
