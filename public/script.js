const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;
const room = 'video-room-1'; // Tên phòng, có thể làm động sau này

// Cấu hình STUN server (cần thiết để vượt qua NAT)
const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302' // Sử dụng STUN server công cộng của Google
        }
    ]
};

// 1. Lấy stream video/audio từ thiết bị của người dùng
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;

        // Sau khi có stream, tham gia vào phòng
        socket.emit('join', room);
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// 2. Xử lý khi có người dùng khác tham gia vào phòng
socket.on('user-joined', () => {
    // Người dùng mới tham gia sẽ là người tạo offer
    createPeerConnection();
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('offer', { room: room, offer: peerConnection.localDescription });
        })
        .catch(e => console.error(e));
});

// 3. Xử lý khi nhận được offer từ người dùng khác
socket.on('offer', offer => {
    // Người dùng nhận được offer sẽ tạo answer
    createPeerConnection();
    peerConnection.setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            socket.emit('answer', { room: room, answer: peerConnection.localDescription });
        })
        .catch(e => console.error(e));
});

// 4. Xử lý khi nhận được answer
socket.on('answer', answer => {
    peerConnection.setRemoteDescription(answer)
        .catch(e => console.error(e));
});

// 5. Xử lý khi nhận được ICE candidate
socket.on('candidate', candidate => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
});

// Hàm tạo và cấu hình RTCPeerConnection
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    // Thêm các track từ local stream vào peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Xử lý khi có ICE candidate mới
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('candidate', { room: room, candidate: event.candidate });
        }
    };

    // Xử lý khi nhận được remote stream
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };
}
