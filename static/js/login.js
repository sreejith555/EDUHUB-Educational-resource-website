// login.js — EduHub Login Page

async function handleLogin() {
  const btn      = document.getElementById('loginBtn');
  const errorBox = document.getElementById('errorBox');
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Clear previous error
  errorBox.style.display = 'none';
  errorBox.textContent   = '';

  if (!username || !password) {
    showError('Please fill in both username and password.');
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Signing in…';

  try {
    const res = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.ok) {
      sessionStorage.setItem('eduhub_user', data.name);
      window.location.href = '/home';
    } else {
      showError(data.msg || 'Invalid username or password.');
      btn.disabled    = false;
      btn.textContent = 'Sign In';
    }
  } catch (err) {
    showError('Network error. Please ensure the server is running.');
    btn.disabled    = false;
    btn.textContent = 'Sign In';
  }
}

function showError(msg) {
  const errorBox = document.getElementById('errorBox');
  errorBox.textContent   = msg;
  errorBox.style.display = 'block';
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('username').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
});
