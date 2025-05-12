document.addEventListener('DOMContentLoaded', function() {

    // --- CODE MỚI CHO NAVIGATION ---
    const nav = document.querySelector('.ocean-nav');
    const navLinks = document.querySelectorAll('.ocean-nav .nav-link');
    const contentSectionsForNav = document.querySelectorAll('header#hero-section, main section[id]');

    // Sticky navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 70) { // Chiều cao bạn muốn nav thay đổi style
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    const activateNavLink = (targetId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });
    };

    const navObserverOptions = {
        rootMargin: '-40% 0px -60% 0px', // Điều chỉnh để active link chính xác hơn
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateNavLink(entry.target.id);
            }
        });
    }, navObserverOptions);

    contentSectionsForNav.forEach(section => {
        navObserver.observe(section);
    });

    // --- KẾT THÚC CODE MỚI CHO NAVIGATION ---


    // 1. Khởi tạo Particles.js cho hiệu ứng nền (bong bóng/sao biển)
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80, // Số lượng hạt
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff" // Màu của hạt
            },
            "shape": {
                "type": "circle", // Hình dạng: circle, edge, triangle, polygon, star, image
            },
            "opacity": {
                "value": 0.4, // Độ trong suốt
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 0.8,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 4, // Kích thước hạt
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 30,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false, // Không nối các hạt
            },
            "move": {
                "enable": true,
                "speed": 1.5, // Tốc độ di chuyển
                "direction": "top", // Hướng di chuyển: none, top, top-right, right, bottom-right, bottom, bottom-left, left, top-left
                "random": true,
                "straight": false, // Di chuyển không theo đường thẳng
                "out_mode": "out", // Ra khỏi màn hình: out, bounce
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false, // Tắt tương tác khi hover
                },
                "onclick": {
                    "enable": false, // Tắt tương tác khi click
                },
                "resize": true
            }
        },
        "retina_detect": true
    });


    // 2. Hiệu ứng Parallax nhẹ cho section (nếu muốn mạnh hơn cần custom scroll)
    // CSS đã xử lý parallax với background-attachment: fixed;

    // 3. Hiệu ứng xuất hiện khi cuộn (Fade-in sections)
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null, // Dùng viewport làm gốc
        rootMargin: '0px',
        threshold: 0.1 // Kích hoạt khi 10% section hiển thị
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 1s ease-out forwards`;
                // Để tránh lặp animation, có thể unobserve sau khi đã kích hoạt
                // observer.unobserve(entry.target);
            } else {
                // Reset animation nếu muốn nó chạy lại khi cuộn lên rồi cuộn xuống
                // entry.target.style.animation = 'none';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0'; // Ẩn ban đầu để animation có tác dụng
        observer.observe(section);
    });

    // 4. Hiệu ứng gợn sóng nhẹ theo chuột trên hero (Tùy chọn, có thể phức tạp)
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;

            // Tính toán độ lệch từ tâm
            const xPos = (offsetX / clientWidth - 0.5) * 40; // Khuếch đại hiệu ứng
            const yPos = (offsetY / clientHeight - 0.5) * 30;

            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate(${xPos * 0.1}px, ${yPos * 0.1}px)`; // Di chuyển nội dung ít hơn
            }

            // Di chuyển các lớp sóng một chút (tinh tế)
            document.querySelector('.wave1').style.backgroundPositionX = `calc(50% + ${xPos * 0.3}px)`;
            document.querySelector('.wave2').style.backgroundPositionX = `calc(50% + ${xPos * 0.2}px)`;
        });
    }

});