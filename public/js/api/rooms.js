document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/api/chat/rooms', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rooms = await res.json();
    const list = document.getElementById('rooms');
    rooms.forEach(r => {
      const div = document.createElement('div');
      div.className = 'room';
      div.innerHTML = `<h3>${r.name}</h3><p>${r.description || ''}</p>` +
                      `<button data-id="${r._id}">Join</button>`;
      list.appendChild(div);
    });

    list.addEventListener('click', async e => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.dataset.id;
        const joinRes = await fetch(`/api/chat/rooms/${id}/join`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (joinRes.ok) {
         // pass token via query in case localStorage is cleared on redirect
          window.location.href = `/chat?room=${id}&token=${encodeURIComponent(token)}`;
        } else {
          alert('Cannot join room');
        }
      }
    });
  } catch (err) {
    console.error(err);
    alert('Failed to load rooms');
  }
});
