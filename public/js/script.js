// public/js/script.js (Thêm Log Debug)

document.addEventListener('DOMContentLoaded', () => {
    console.log("[DEBUG] DOM loaded. Setting up listeners.");

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log("[DEBUG] Login form found.");
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log("[DEBUG] Login form NOT found.");
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        console.log("[DEBUG] Register form found.");
        registerForm.addEventListener('submit', handleRegister);
    } else {
         console.log("[DEBUG] Register form NOT found.");
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
         console.log("[DEBUG] Logout button found.");
        logoutButton.addEventListener('click', handleLogout);
    } else {
         console.log("[DEBUG] Logout button NOT found.");
    }

    const profilePageIndicator = document.getElementById('profile-user-info');
    if (profilePageIndicator) {
        console.log("[DEBUG] Profile page detected.");
        fetchUserProfile();
    } else {
         console.log("[DEBUG] Not profile page.");
    }
});

// --- Hàm xử lý Đăng nhập ---
async function handleLogin(event) {
    event.preventDefault();
    console.log("[DEBUG] handleLogin triggered.");

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const messageDiv = document.getElementById('login-message');

    if(messageDiv) messageDiv.textContent = '';

    if (!usernameInput || !passwordInput) {
         console.error("[DEBUG] Login inputs NOT found!");
         if(messageDiv) messageDiv.textContent = "Lỗi: Không tìm thấy ô nhập liệu.";
         return;
     }

    const username = usernameInput.value;
    const password = passwordInput.value;
    console.log(`[DEBUG] Attempting login for: ${username}`);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log("[DEBUG] Login fetch completed. Status:", response.status);

        // Cố gắng đọc response body dù có lỗi hay không để debug
        let result;
        try {
             result = await response.json();
             console.log("[DEBUG] Login response body (parsed JSON):", result);
        } catch (jsonError) {
             console.error("[DEBUG] Error parsing login response JSON:", jsonError);
             const textResponse = await response.text(); // Thử đọc dạng text nếu JSON lỗi
             console.error("[DEBUG] Login response body (raw text):", textResponse);
              if(messageDiv) messageDiv.textContent = 'Lỗi đọc phản hồi từ server.';
              if(messageDiv) messageDiv.style.color = 'red';
             return; // Dừng lại nếu không parse được JSON
        }


        // --- Kiểm tra điều kiện và Log chi tiết ---
        if (response.ok && result && result.token) {
            console.log("[DEBUG] >>> CONDITION MET: response OK and result.token exists.");
            console.log("[DEBUG] >>> Token value:", result.token); // Log giá trị token

            try {
                console.log("[DEBUG] >>> Attempting localStorage.setItem...");
                localStorage.setItem('authToken', result.token);
                console.log("[DEBUG] >>> localStorage.setItem FINISHED (check Application tab).");

                // Đọc lại ngay lập tức để xác nhận
                const savedToken = localStorage.getItem('authToken');
                console.log("[DEBUG] >>> Value read back from localStorage:", savedToken);

                if(messageDiv) messageDiv.textContent = result.message + ". Token đã lưu. Chuyển hướng bị TẮT để debug.";
                if(messageDiv) messageDiv.style.color = 'green';

                // --- TẠM THỜI VÔ HIỆU HÓA CHUYỂN HƯỚNG ---
                console.log("[DEBUG] >>> REDIRECT DISABLED FOR TESTING. Check console and localStorage.");
                 window.location.href = '/profile'; // Dòng này đang bị tắt

            } catch (storageError) {
                console.error("[DEBUG] >>> ERROR saving to localStorage:", storageError);
                 if(messageDiv) messageDiv.textContent = 'Lỗi lưu token vào localStorage.';
                 if(messageDiv) messageDiv.style.color = 'red';
            }

        } else {
            // Log lý do điều kiện sai
            console.error("[DEBUG] >>> CONDITION FAILED. Details:");
            console.error("[DEBUG]     response.ok:", response.ok);
            console.error("[DEBUG]     result object:", result);
            console.error("[DEBUG]     result.token exists:", !!(result && result.token));
            console.error("[DEBUG] Login failed message:", result ? result.message : 'No result message');
            if(messageDiv) messageDiv.textContent = 'Lỗi: ' + (result ? result.message : 'Đăng nhập thất bại (không nhận được token hợp lệ)');
            if(messageDiv) messageDiv.style.color = 'red';
        }
    } catch (fetchError) {
        console.error('[DEBUG] Client-side FETCH error during login:', fetchError);
        if(messageDiv) messageDiv.textContent = 'Lỗi kết nối phía client khi đăng nhập.';
        if(messageDiv) messageDiv.style.color = 'red';
    }
}

// --- Các hàm handleRegister, fetchUserProfile, handleLogout giữ nguyên như trước ---
// (Copy lại các hàm đó vào đây nếu cần)
// --- Hàm xử lý Đăng ký ---
async function handleRegister(event) {
    event.preventDefault();
    console.log("[DEBUG] handleRegister triggered.");
    // ... (code còn lại của handleRegister) ...
     const usernameInput = document.getElementById('register-username');
     const passwordInput = document.getElementById('register-password');
     const messageDiv = document.getElementById('register-message');

     if(messageDiv) messageDiv.textContent = '';

      if (!usernameInput || !passwordInput) {
          console.error("[DEBUG] Register inputs NOT found!");
          if(messageDiv) messageDiv.textContent = "Lỗi: Không tìm thấy ô nhập liệu.";
          return;
      }

     const username = usernameInput.value;
     const password = passwordInput.value;
      console.log(`[DEBUG] Attempting registration for: ${username}`);

     try {
         const response = await fetch('/api/register', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ username, password })
         });
          console.log("[DEBUG] Register fetch completed. Status:", response.status);

         let result;
         try {
              result = await response.json();
              console.log("[DEBUG] Register response body (parsed JSON):", result);
         } catch (jsonError) {
              console.error("[DEBUG] Error parsing register response JSON:", jsonError);
              const textResponse = await response.text();
              console.error("[DEBUG] Register response body (raw text):", textResponse);
               if(messageDiv) messageDiv.textContent = 'Lỗi đọc phản hồi từ server.';
               if(messageDiv) messageDiv.style.color = 'red';
              return;
         }

         if (response.ok) {
              console.log("[DEBUG] Registration successful.");
              if(messageDiv) messageDiv.textContent = result.message + ". Bạn có thể đăng nhập ngay bây giờ.";
              if(messageDiv) messageDiv.style.color = 'green';
         } else {
              console.error("[DEBUG] Registration failed:", result ? result.message : 'Unknown error');
              if(messageDiv) messageDiv.textContent = 'Lỗi: ' + (result ? result.message : 'Đăng ký thất bại');
              if(messageDiv) messageDiv.style.color = 'red';
         }
     } catch (fetchError) {
         console.error('[DEBUG] Client-side FETCH error during registration:', fetchError);
          if(messageDiv) messageDiv.textContent = 'Lỗi kết nối phía client khi đăng ký.';
          if(messageDiv) messageDiv.style.color = 'red';
     }
}

// --- Hàm gọi API lấy thông tin User ---
async function fetchUserProfile() {
      console.log("[DEBUG] fetchUserProfile triggered.");
     const token = localStorage.getItem('authToken');
     const profileInfoDiv = document.getElementById('profile-user-info');
     const profileMessageDiv = document.getElementById('profile-message');

     if (!token) {
         console.log('[DEBUG] No token found for profile fetch. Redirecting.');
         if(profileMessageDiv) profileMessageDiv.textContent = 'Bạn chưa đăng nhập. Đang chuyển hướng...';
         setTimeout(() => { window.location.href = '/login'; }, 2000);
         return;
     }

     console.log("[DEBUG] Token found. Fetching /api/profile");
     if(profileMessageDiv) profileMessageDiv.textContent = 'Đang tải thông tin...';

     try {
         const response = await fetch('/api/profile', {
             method: 'GET',
             headers: { 'Authorization': `Bearer ${token}` }
         });
          console.log("[DEBUG] Profile API response status:", response.status);

         if (response.ok) {
             const userData = await response.json();
             console.log("[DEBUG] Profile data received:", userData);
             if(profileMessageDiv) profileMessageDiv.textContent = '';

             if(profileInfoDiv) {
                  profileInfoDiv.innerHTML = `
                     <p><strong>Tên đăng nhập:</strong> ${userData.username || 'N/A'}</p>
                     <p><strong>User ID:</strong> ${userData.userId || 'N/A'}</p>
                     `;
             } else {
                  console.error("[DEBUG] Profile info div NOT found!");
             }
         } else if (response.status === 401 || response.status === 403) {
             console.error('[DEBUG] Token invalid/expired for profile fetch. Redirecting.');
             if(profileMessageDiv) profileMessageDiv.textContent = 'Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.';
             localStorage.removeItem('authToken');
             setTimeout(() => { window.location.href = '/login'; }, 2000);
         } else {
             const errorText = await response.text();
             console.error('[DEBUG] Failed to fetch profile:', response.status, errorText);
             if(profileMessageDiv) profileMessageDiv.textContent = 'Lỗi tải thông tin hồ sơ: ' + (errorText || response.statusText);
         }
     } catch (fetchError) {
         console.error('[DEBUG] Client-side FETCH error fetching profile:', fetchError);
          if(profileMessageDiv) profileMessageDiv.textContent = 'Lỗi kết nối phía client khi tải thông tin.';
     }
}

// --- Hàm xử lý Đăng xuất ---
function handleLogout() {
     console.log("[DEBUG] handleLogout triggered.");
     localStorage.removeItem('authToken');
     alert('Bạn đã đăng xuất!');
     console.log("[DEBUG] Redirecting to /login");
     window.location.href = '/login';
}
