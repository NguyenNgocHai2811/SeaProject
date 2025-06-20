const loginForm = document.getElementById('loginForm');
const loginMsg  = document.getElementById('message');

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    username:    loginForm.username.value,
    password: loginForm.password.value,
  };
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    loginMsg.textContent = json.token ? 'Login successful' : json.message;
    loginMsg.className = res.ok ? 'message success' : 'message error';
    if (res.ok && json.token) {
      localStorage.setItem('token', json.token);
      window.location.href = '/profile';
    }
  } catch (err) {
    loginMsg.textContent = 'Network error';
    loginMsg.className = 'message error';
  }
});
