// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Setting up event listeners.");

    // --- Gắn sự kiện cho Form Đăng nhập ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log("Login form found. Attaching submit listener.");
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log("Login form not found on this page.");
    }

    // --- Gắn sự kiện cho Form Đăng ký ---
    const registerForm = document.getElementById('register-form'); // Cần id="register-form" trong register.html
    if (registerForm) {
        console.log("Register form found. Attaching submit listener.");
        registerForm.addEventListener('submit', handleRegister);
    } else {
         console.log("Register form not found on this page.");
    }

    // --- Gắn sự kiện cho Nút Đăng xuất ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
         console.log("Logout button found. Attaching click listener.");
        logoutButton.addEventListener('click', handleLogout);
    } else {
         console.log("Logout button not found on this page.");
    }

    // --- Tự động gọi hàm lấy profile nếu đang ở trang profile ---
    const profilePageIndicator = document.getElementById('profile-user-info');
    if (profilePageIndicator) {
        console.log("Profile page detected. Fetching user profile.");
        fetchUserProfile();
    } else {
         console.log("Not on profile page or profile indicator not found.");
    }
});

// --- Hàm xử lý Đăng nhập ---
async function handleLogin(event) {
    event.preventDefault();
    console.log("Handling login form submission...");

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const messageDiv = document.getElementById('login-message');

    if(messageDiv) messageDiv.textContent = ''; // Xóa thông báo cũ

    if (!usernameInput || !passwordInput) {
         console.error("Login form inputs not found!");
         if(messageDiv) messageDiv.textContent = "Lỗi: Không tìm thấy ô nhập liệu.";
         return;
     }

    const username = usernameInput.value;
    const password = passwordInput.value;
    console.log(`Attempting login for user: ${username}`);

    try {
        // --- Sửa URL fetch ---
        const response = await fetch('/api/login', { // Gọi API với prefix /api
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        console.log("Login API response status:", response.status);
        console.log("Login API response body:", result);

        if (response.ok && result.token) {
            console.log("Login successful. Saving token to localStorage.");
            localStorage.setItem('authToken', result.token); // Lưu token

            if(messageDiv) messageDiv.textContent = result.message + ". Đang chuyển hướng...";
            if(messageDiv) messageDiv.style.color = 'green';

            console.log("Redirecting to /profile");
            window.location.href = '/profile'; // Chuyển hướng đến trang profile
        } else {
             console.error("Login failed:", result.message || 'Unknown error');
             if(messageDiv) messageDiv.textContent = 'Lỗi: ' + (result.message || 'Đăng nhập thất bại');
             if(messageDiv) messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Client-side error during login:', error);
        if(messageDiv) messageDiv.textContent = 'Có lỗi xảy ra phía client khi đăng nhập.';
        if(messageDiv) messageDiv.style.color = 'red';
    }
}

// --- Hàm xử lý Đăng ký ---
async function handleRegister(event) {
    event.preventDefault();
    console.log("Handling register form submission...");

    const usernameInput = document.getElementById('register-username'); // Cần id="register-username" trong register.html
    const passwordInput = document.getElementById('register-password'); // Cần id="register-password" trong register.html
    const messageDiv = document.getElementById('register-message');   // Cần id="register-message" trong register.html

    if(messageDiv) messageDiv.textContent = ''; // Xóa thông báo cũ

     if (!usernameInput || !passwordInput) {
         console.error("Register form inputs not found!");
         if(messageDiv) messageDiv.textContent = "Lỗi: Không tìm thấy ô nhập liệu.";
         return;
     }

    const username = usernameInput.value;
    const password = passwordInput.value;
     console.log(`Attempting registration for user: ${username}`);

    try {
         // --- Sửa URL fetch ---
        const response = await fetch('/api/register', { // Gọi API với prefix /api
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
         console.log("Register API response status:", response.status);
         console.log("Register API response body:", result);

        if (response.ok) {
             console.log("Registration successful.");
             if(messageDiv) messageDiv.textContent = result.message + ". Bạn có thể đăng nhập ngay bây giờ.";
             if(messageDiv) messageDiv.style.color = 'green';
             // registerForm.reset(); // Có thể xóa trống form
        } else {
             console.error("Registration failed:", result.message || 'Unknown error');
             if(messageDiv) messageDiv.textContent = 'Lỗi: ' + (result.message || 'Đăng ký thất bại');
             if(messageDiv) messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Client-side error during registration:', error);
         if(messageDiv) messageDiv.textContent = 'Có lỗi xảy ra phía client khi đăng ký.';
         if(messageDiv) messageDiv.style.color = 'red';
    }
}

// --- Hàm gọi API lấy thông tin User ---
async function fetchUserProfile() {
     console.log("Fetching user profile...");
    const token = localStorage.getItem('authToken');
    const profileInfoDiv = document.getElementById('profile-user-info');
    const profileMessageDiv = document.getElementById('profile-message');

    if (!token) {
        console.log('No auth token found in localStorage. Redirecting to login.');
        if(profileMessageDiv) profileMessageDiv.textContent = 'Bạn chưa đăng nhập. Đang chuyển hướng...';
        // Chuyển hướng về trang đăng nhập nếu không có token
        setTimeout(() => { window.location.href = '/login'; }, 2000); // Chuyển về /login (route phục vụ trang)
        return;
    }

    console.log("Auth token found. Fetching from /api/profile");
    if(profileMessageDiv) profileMessageDiv.textContent = 'Đang tải thông tin...';

    try {
         // --- Sửa URL fetch ---
        const response = await fetch('/api/profile', { // Gọi API với prefix /api
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token
            }
        });

         console.log("Profile API response status:", response.status);

        if (response.ok) {
            const userData = await response.json();
            console.log("Profile data received:", userData);
            if(profileMessageDiv) profileMessageDiv.textContent = ''; // Xóa thông báo loading

            // Hiển thị thông tin user lên trang
            if(profileInfoDiv) {
                 profileInfoDiv.innerHTML = `
                    <p><strong>Tên đăng nhập:</strong> ${userData.username || 'N/A'}</p>
                    <p><strong>User ID:</strong> ${userData.userId || 'N/A'}</p>
                    `;
            } else {
                 console.error("Profile info div ('profile-user-info') not found!");
            }
        } else if (response.status === 401 || response.status === 403) {
            // Token không hợp lệ hoặc hết hạn
            console.error('Auth token is invalid or expired. Redirecting to login.');
            if(profileMessageDiv) profileMessageDiv.textContent = 'Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.';
            localStorage.removeItem('authToken'); // Xóa token cũ
            // Chuyển hướng về trang đăng nhập
            setTimeout(() => { window.location.href = '/login'; }, 2000);
        } else {
            // Lỗi khác từ server
            const errorText = await response.text();
            console.error('Failed to fetch profile:', response.status, errorText);
            if(profileMessageDiv) profileMessageDiv.textContent = 'Lỗi tải thông tin hồ sơ: ' + (errorText || response.statusText);
        }
    } catch (error) {
        console.error('Client-side error fetching profile:', error);
         if(profileMessageDiv) profileMessageDiv.textContent = 'Lỗi kết nối phía client khi tải thông tin.';
    }
}

// --- Hàm xử lý Đăng xuất ---
function handleLogout() {
    console.log("Handling logout.");
    localStorage.removeItem('authToken'); // Xóa token khỏi localStorage
    alert('Bạn đã đăng xuất!');
    console.log("Redirecting to /login");
    window.location.href = '/login'; // Chuyển về trang đăng nhập
}
