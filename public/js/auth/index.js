
  document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const loginLink    = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const userLink     = document.getElementById('userLink');

    if (token) {
      // Có token: fetch profile để lấy username
      try {
        const res = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();

        const user = await res.json();
        // Ẩn Login & Register
        loginLink.style.display    = 'none';
        registerLink.style.display = 'none';
        // Hiện username
        userLink.style.display     = 'inline-block';
        userLink.textContent       = user.username;
      } catch {
        // nếu token sai hoặc hết hạn
        localStorage.removeItem('token');
        window.location.reload();
      }
    } else {
      // Chưa có token: vẫn chỉ hiển thị Login & Register
      userLink.style.display = 'none';
    }
  });
