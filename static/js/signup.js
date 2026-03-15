async function handleSignup() {
  const btn        = document.getElementById('signupBtn');
  const errorBox   = document.getElementById('errorBox');
  const successBox = document.getElementById('successBox');
  const fullname   = document.getElementById('fullname').value.trim();
  const email      = document.getElementById('email').value.trim();
  const password   = document.getElementById('password').value.trim();
  const confirm    = document.getElementById('confirm').value.trim();

  errorBox.style.display   = 'none';
  successBox.style.display = 'none';

  if (!fullname || !email || !password || !confirm) { showError('Please fill in all fields.'); return; }
  if (fullname.length < 3) { showError('Full name must be at least 3 characters.'); return; }
  if (!email.includes('@')) { showError('Please enter a valid email address.'); return; }
  if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }
  if (password !== confirm) { showError('Passwords do not match.'); return; }

  btn.disabled  = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account…';

  try {
    const res  = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password })
    });
    const data = await res.json();
    if (data.ok) {
      successBox.innerHTML     = '<i class="fa-solid fa-circle-check"></i> Account created! Redirecting…';
      successBox.style.display = 'block';
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } else {
      showError(data.msg || 'Something went wrong.');
      btn.disabled  = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
    }
  } catch (err) {
    showError('Network error. Please ensure the server is running.');
    btn.disabled  = false;
    btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
  }
}

function showError(msg) {
  const errorBox = document.getElementById('errorBox');
  errorBox.innerHTML     = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg;
  errorBox.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSignup();
  });
});