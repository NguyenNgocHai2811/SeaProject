// public/js/auth/profile.js

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Fetch user info
  let user;
  try {
    const res = await fetch('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');

    user = await res.json();
    document.getElementById('username').textContent = user.username;
    document.getElementById('email').textContent    = user.email;
    document.getElementById('createdAt').textContent = new Date(user.createdAt).toLocaleDateString();

    // Display saved avatar or fallback
    const avatarEl = document.getElementById('avatar');
    avatarEl.src = user.avatarUrl || '/images/default-avatar.png';
  } catch (err) {
    console.error(err);
    localStorage.removeItem('token');
    window.location.href = '/login.html';
    return;
  }

  // Preview selected image before upload
  const avatarInput = document.getElementById('avatarInput');
  avatarInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('avatar').src = URL.createObjectURL(file);
    }
  });

  // Handle avatar upload
  const saveBtn = document.getElementById('saveAvatarBtn');
  saveBtn.addEventListener('click', async () => {
    const file = avatarInput.files[0];
    if (!file) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      user.avatarUrl = data.avatarUrl;          // update local user object
      document.getElementById('avatar').src = data.avatarUrl;  // show new avatar
      alert('Avatar updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error uploading avatar');
    }
  });

  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });
});
