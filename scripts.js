document.addEventListener("DOMContentLoaded", function () {
    const nodes = document.querySelectorAll(".node");
    const tooltip = document.getElementById("tooltip");
  
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            nodes.forEach(node => {
                node.addEventListener("mouseenter", function () {
                    const id = this.getAttribute("data-id");
                    const info = data[id];
  
                    if (info) {
                        // Chuyển danh sách chuyên môn từ chuỗi thành danh sách HTML
                        const specialtyList = info.specialty
                            .split(",")
                            .map(item => `<li>${item.trim()}</li>`)
                            .join("");
  
                        tooltip.innerHTML = `
                            <strong>${info.name}</strong><br><br>
                            <b>Chức vụ:</b> ${info.position}<br>
                            <b>Chuyên môn:</b>
                            <ul>${specialtyList}</ul>
                            <b>Hợp đồng:</b> ${info.contract}
                        `;
                        tooltip.classList.add("show");
  
                        // Lấy vị trí phần tử node
                        const rect = this.getBoundingClientRect();
                        const scrollTop = window.scrollY || document.documentElement.scrollTop;
                        const windowWidth = window.innerWidth;
  
                        let leftPosition = rect.right + 10; // Mặc định hiển thị bên phải
                        let tooltipDirection = "tooltip-right"; // Class CSS mặc định
  
                        // Nếu tooltip bị tràn khỏi màn hình bên phải, hiển thị bên trái
                        if (rect.right + 250 > windowWidth) {
                            leftPosition = rect.left - 260; // Dịch tooltip sang trái
                            tooltipDirection = "tooltip-left"; // Đổi class hiển thị bên trái
                        }
  
                        // Áp dụng vị trí tooltip
                        tooltip.style.top = rect.top + scrollTop + "px";
                        tooltip.style.left = leftPosition + "px";
  
                        // Xóa class cũ và thêm class mới để kiểm soát hướng tooltip
                        tooltip.classList.remove("tooltip-right", "tooltip-left");
                        tooltip.classList.add(tooltipDirection);
                    }
                });
  
                node.addEventListener("mouseleave", function () {
                    tooltip.classList.remove("show");
                });
            });
        });
  });
  //phần function của popup//
  document.addEventListener("DOMContentLoaded", function () {
    const nodes = document.querySelectorAll(".node");
    const popup = document.getElementById("profile-popup");
    const overlay = document.getElementById("popup-overlay");
    const closeBtn = document.querySelector(".close-popup");
    const popupImage = document.getElementById("popup-image");
  
    function showPopup() {
        popup.classList.add("show");
        overlay.classList.add("show");
    }
  
    function hidePopup() {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    }
  
    // Kiểm tra mật khẩu từ localStorage
    function isAuthenticated() {
        const lastLogin = localStorage.getItem("lastLogin");
        if (!lastLogin) return false; // Chưa đăng nhập
        const timeElapsed = Date.now() - parseInt(lastLogin, 10);
        return timeElapsed < 1 * 60 * 1000; // Kiểm tra nếu dưới 30 phút
    }
  
    function requestPassword(callback) {
        if (isAuthenticated()) {
            callback(); // Nếu đã đăng nhập, mở popup ngay
        } else {
            const password = prompt("Nhập mật khẩu để xem thông tin:");
            if (password === "123456") {
                localStorage.setItem("lastLogin", Date.now().toString()); // Lưu thời gian đăng nhập
                callback(); // Gọi hàm mở popup
            } else {
                alert("Mật khẩu không đúng!");
            }
        }
    }
  
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            nodes.forEach(node => {
                node.addEventListener("click", function () {
                    requestPassword(() => {
                        const id = this.getAttribute("data-id");
                        const info = data[id];
                        const imgElement = this.querySelector("img");
  
                        if (info && imgElement) {
                            popupImage.src = imgElement.src;
                            popupImage.alt = info.name;
                            document.getElementById("popup-name").textContent = info.name;
  
                            formatList("popup-education", info.education);
                            formatList("popup-major", info.major);
                            formatList("popup-languages", info.languages);
                            formatList("popup-experience", info.experience);
                            formatList("popup-strengths", info.strengths);
                            formatList("popup-historical_working", info.historical_working);
  
                            showPopup();
                        }
                    });
                });
            });
        });
  
    closeBtn.addEventListener("click", hidePopup);
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            hidePopup();
        }
    });
  
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            hidePopup();
        }
    });
  
    // Hàm xử lý hiển thị danh sách gạch đầu dòng
    function formatList(elementId, data) {
        const element = document.getElementById(elementId);
        element.innerHTML = "";
  
        if (data) {
            if (data.includes(",")) {
                const items = data.split(",").map(item => `<li>${item.trim()}</li>`).join("");
                element.innerHTML = `<ul>${items}</ul>`;
            } else {
                element.innerHTML = data;
            }
        } else {
            element.innerHTML = "Chưa cập nhật";
        }
    }
  
    // Thêm sự kiện để phóng to ảnh khi click
    popupImage.addEventListener("click", function () {
        const fullscreenOverlay = document.createElement("div");
        fullscreenOverlay.style.position = "fixed";
        fullscreenOverlay.style.top = "0";
        fullscreenOverlay.style.left = "0";
        fullscreenOverlay.style.width = "100vw";
        fullscreenOverlay.style.height = "100vh";
        fullscreenOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        fullscreenOverlay.style.display = "flex";
        fullscreenOverlay.style.alignItems = "center";
        fullscreenOverlay.style.justifyContent = "center";
        fullscreenOverlay.style.zIndex = "1000";
  
        const fullscreenImage = document.createElement("img");
        fullscreenImage.src = popupImage.src;
        fullscreenImage.alt = popupImage.alt;
        fullscreenImage.style.maxWidth = "90%";
        fullscreenImage.style.maxHeight = "90%";
        fullscreenImage.style.borderRadius = "10px";
        fullscreenImage.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.5)";
  
        fullscreenOverlay.appendChild(fullscreenImage);
        document.body.appendChild(fullscreenOverlay);
  
        fullscreenOverlay.addEventListener("click", function () {
            document.body.removeChild(fullscreenOverlay);
        });
    });
  });
  //chức năng logout
  document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-button");
  
    // Ẩn nút logout nếu đang ở trang login.html
    if (window.location.pathname.includes("login.html")) {
        if (logoutButton) logoutButton.style.display = "none";
    }
  
    // Chức năng đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("lastLoginTime");
            localStorage.removeItem("username");
            window.location.href = "login.html"; // Chuyển về trang đăng nhập
        });
    }
  });
  