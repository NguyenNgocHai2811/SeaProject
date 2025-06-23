const socket = io();
const roomId = 'global';
const userInput = document.getElementById('inpUser');
const msgInput  = document.getElementById('inpMsg');
const msgsList  = document.getElementById('msgs');
const typingEl  = document.getElementById('typing');

socket.emit('joinRoom', roomId);

document.getElementById('btnSend').onclick = () => {
  const user = userInput.value.trim();
  const text = msgInput.value.trim();
  if (!user || !text) return;
  socket.emit('chatMessage', { roomId, user, text });
  msgInput.value = '';
};

socket.on('newMessage', msg => {
  const li = document.createElement('li');
  li.textContent = `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
  msgsList.appendChild(li);
});

msgInput.addEventListener('input', () => {
  const user = userInput.value.trim();
  socket.emit('typing', { roomId, user });
});

socket.on('userTyping', user => {
  typingEl.textContent = `${user} đang gõ...`;
  setTimeout(() => typingEl.textContent = '', 1000);
});