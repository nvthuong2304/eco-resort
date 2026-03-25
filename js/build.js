// Hàm cập nhật hiển thị các con số trên màn hình
function updateBuildUI() {
    const scoinElement = document.getElementById('display-scoin');
    const incomeElement = document.getElementById('display-income');
    const levelElement = document.getElementById('resort-level');

    if (scoinElement) scoinElement.innerText = Math.floor(scoin).toLocaleString();
    if (incomeElement) incomeElement.innerText = income.toLocaleString();
    
    // Giả lập cấp độ Khu du lịch dựa trên thu nhập
    if (levelElement) {
        let lv = Math.floor(income / 500) + 1;
        levelElement.innerText = "Cấp " + lv;
    }
}

// Hàm xử lý mua Bungalow
function buyBungalow() {
    const price = 1000;
    const addIncome = 100;

    if (scoin >= price) {
        scoin -= price;
        income += addIncome;
        
        // Hiệu ứng thông báo của Telegram (nếu đang chạy trong Telegram)
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        
        alert("🏗️ Chúc mừng! Bạn đã xây thêm 1 Bungalow gỗ.");
        updateBuildUI();
    } else {
        alert("❌ Bạn cần thêm " + (price - scoin).toLocaleString() + " Scoin nữa!");
    }
}

// Hàm xử lý mua Hồ Bơi (Nếu bạn muốn thêm nút này vào HTML sau này)
function buyPool() {
    const price = 5000;
    const addIncome = 600;

    if (scoin >= price) {
        scoin -= price;
        income += addIncome;
        alert("🌊 Tuyệt vời! Hồ bơi vô cực đã hoàn thành.");
        updateBuildUI();
    } else {
        alert("❌ Không đủ Scoin để xây hồ bơi!");
    }
}

// Khởi tạo hiển thị ngay khi vào tab
updateBuildUI();

// Cơ chế cộng tiền tự động (Mining)
// Kiểm tra nếu chưa có vòng lặp nào chạy thì mới tạo để tránh bị nhân đôi tốc độ
if (!window.buildInterval) {
    window.buildInterval = setInterval(() => {
        // Cộng thu nhập mỗi giây (income là mỗi giờ, chia 3600)
        // Để game nhanh hơn, ta chia cho 600 (cộng mỗi 6 giây là 1 phút trong game)
        if (income > 0) {
            scoin += (income / 100); 
            updateBuildUI();
        }
    }, 1000); 
}
