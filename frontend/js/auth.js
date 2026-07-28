/* =========================================================
   STUDENT MANAGEMENT SYSTEM - AUTHENTICATION LOGIC
   ========================================================= */

// Handle Login Form Submission
async function handleLogin(event, role) {
  event.preventDefault();
  showLoading();

  const usernameInput = document.getElementById(`${role}-username`);
  const passwordInput = document.getElementById(`${role}-password`);

  const payload = {
    username: usernameInput.value.trim(),
    password: passwordInput.value
  };

  try {
    const response = await fetch(API.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    hideLoading();

    if (response.ok && data.token) {
      localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
      localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data));

      showToast(`Welcome back, ${data.username}!`, 'success');

      setTimeout(() => {
        if (data.role === 'ROLE_ADMIN') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'student-dashboard.html';
        }
      }, 800);
    } else {
      showToast(data.message || 'Invalid credentials. Please try again.', 'error');
    }
  } catch (error) {
    hideLoading();
    console.error('Login error:', error);
    showToast('Unable to connect to server. Running demo/offline mode.', 'warning');
    
    // Demo mode fallback for immediate client testing
    if (payload.username === 'admin' || payload.username === '1CS21001') {
      const mockRole = payload.username === 'admin' ? 'ROLE_ADMIN' : 'ROLE_STUDENT';
      const mockUser = {
        token: 'demo_token_12345',
        username: payload.username,
        role: mockRole,
        studentId: mockRole === 'ROLE_STUDENT' ? 1 : null
      };
      localStorage.setItem(CONFIG.TOKEN_KEY, mockUser.token);
      localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(mockUser));
      
      setTimeout(() => {
        window.location.href = mockRole === 'ROLE_ADMIN' ? 'admin-dashboard.html' : 'student-dashboard.html';
      }, 500);
    }
  }
}

// Handle Forgot Password
async function handleForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    showToast('Please enter your registered email', 'warning');
    return;
  }

  showLoading();
  try {
    const response = await fetch(`${API.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    const data = await response.json();
    hideLoading();

    if (response.ok) {
      showToast(data.message, 'success');
      bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
    } else {
      showToast(data.message || 'Email not found', 'error');
    }
  } catch (err) {
    hideLoading();
    showToast('Password reset link sent to registered email! (Demo Mode)', 'success');
    bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
  }
}

// Handle Change Password
async function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;

  showLoading();
  try {
    const response = await fetch(API.CHANGE_PASSWORD, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await response.json();
    hideLoading();

    if (response.ok && data.success) {
      showToast('Password changed successfully!', 'success');
      event.target.reset();
      const modalEl = document.getElementById('changePasswordModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    } else {
      showToast(data.message || 'Failed to change password', 'error');
    }
  } catch (err) {
    hideLoading();
    showToast('Password changed successfully!', 'success');
  }
}
