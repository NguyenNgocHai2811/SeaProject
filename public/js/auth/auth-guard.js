// public/js/auth/auth-guard.js

(function() {
  const token = localStorage.getItem('token');

  // If there is no token and we are not on the login/register page,
  // redirect to the login page.
  if (!token) {
    // Make sure we are not already on the root (login) or register page to avoid a redirect loop.
    if (window.location.pathname !== '/' && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
      window.location.href = '/';
    }
  }
})();
