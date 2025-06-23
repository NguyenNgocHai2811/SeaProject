const socket = io();
const roomId = 'global';
let username = '';
const msgInput = document.getElementById('inpMsg');
const msgsList = document.getElementById('msgs');
const typingEl = document.getElementById('typing');
const joinBtn = document.getElementById('joinBtn');
const joinSection = document.getElementById('joinSection');

function addMessage(msg) {
  const li = document.createElement('li');
  li.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
  msgsList.appendChild(li);
}

async function loadUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  const res = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  const user = await res.json();
  return { token, username: user.username };
}

function setBackgroundByTime() {
  const hour = new Date().getHours();
  if (hour < 12) document.body.classList.add('morning');
  else if (hour < 18) document.body.classList.add('afternoon');
  else document.body.classList.add('night');
}

async function init() {
  setBackgroundByTime();
  const info = await loadUser();
  if (!info) return;
  username = info.username;
  const token = info.token;

  joinBtn.onclick = async () => {
    socket.emit('joinRoom', roomId);
    const res = await fetch(`/api/chat/history/${roomId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) {
      const history = await res.json();
      history.forEach(addMessage);
    }
    joinSection.style.display = 'none';
  };

  document.getElementById('btnSend').onclick = () => {
    const text = msgInput.value.trim();
    if (!text) return;
    socket.emit('chatMessage', { roomId, user: username, text });
    msgInput.value = '';
  };

  msgInput.addEventListener('input', () => {
    socket.emit('typing', { roomId, user: username });
  });

  socket.on('newMessage', addMessage);
  socket.on('userTyping', (user) => {
    typingEl.textContent = `${user} đang gõ...`;
    setTimeout(() => (typingEl.textContent = ''), 1000);
  });
}

document.addEventListener('DOMContentLoaded', init);
