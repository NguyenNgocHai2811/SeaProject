// public/js/chat.js
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('room');
  if (!roomId) {
    return alert('Không xác định phòng chat');
  }

   let token = localStorage.getItem('token');
  // allow token from query string when redirected from rooms page
  const tokenParam = params.get('token');
  if (!token && tokenParam) {
    token = tokenParam;
    localStorage.setItem('token', token);
  }
  
  if (!token) {
    return alert('Bạn chưa đăng nhập');
  }

  // 1) Join room
  // 1) Join room (phải POST chứ không phải GET)
 const joinRes = await fetch(`/api/chat/rooms/${roomId}/join`, {
  method: 'POST',
   headers: {
     'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
 });
if (!joinRes.ok) {
  console.error('Join room failed:', await joinRes.text());
  return alert('Không thể join vào phòng chat');
}


  // 2) Fetch lịch sử
  const historyRes = await fetch(`/api/chat/rooms/${roomId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!historyRes.ok) {
    console.error('Fetch history failed:', await historyRes.text());
    return alert('Không lấy được lịch sử chat');
  }
  const msgs = await historyRes.json();

  // 3) Render lịch sử
  const messagesEl = document.getElementById('messages');
  msgs.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.sender.username || msg.sender._id}</strong>: ${msg.text}`;
    messagesEl.appendChild(div);
  });

  // 4) Kết nối Socket.io
  const socket = io({
    auth: { token }
  });
  socket.emit('joinRoom', roomId);
  socket.on('newMessage', msg => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.sender.username || msg.sender._id}</strong>: ${msg.text}`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

  // 5) Gửi tin nhắn mới
  document.getElementById('chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    socket.emit('sendMessage', { roomId, text });
    input.value = '';
  });
});
