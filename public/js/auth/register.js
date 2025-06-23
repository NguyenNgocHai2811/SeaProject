const messageEl    = document.getElementById('message');

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    username: registerForm.username.value,
    email:    registerForm.email.value,
    password: registerForm.password.value,
  };
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    messageEl.textContent = json.message || json.error;
    messageEl.className = res.ok ? 'message success' : 'message error';
    if (res.ok) {
      registerForm.reset();
      // redirect to login after showing success message
       setTimeout(() => window.location.href = '/login', 2000);
    }
  } catch (err) {
    messageEl.textContent = 'Network error';
    messageEl.className = 'message error';
  }
});
