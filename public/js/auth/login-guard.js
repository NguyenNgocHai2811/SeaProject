// public/js/auth/login-guard.js

(function() {
  const token = localStorage.getItem('token');

  // If a token exists (user is already logged in),
  // redirect them away from login/register pages to the main app page.
  if (token) {
    window.location.href = '/index.html';
  }
})();
