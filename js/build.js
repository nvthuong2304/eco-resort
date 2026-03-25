// Gắn hàm update vào window để đảm bảo gọi được ở mọi nơi
window.updateBuildUI = function() {
    const sElem = document.getElementById('display-scoin');
    const iElem = document.getElementById('display-income');
    const lElem = document.getElementById('resort-level');

    if (sElem) sElem.innerText = Math.floor(window.scoin).toLocaleString();
    if (iElem) iElem.innerText = window.income.toLocaleString();
    if (lElem) lElem.innerText = "Cấp " + (Math.floor(window.income / 1000) + 1);
};

// Gắn hàm mua vào window để HTML có thể tìm thấy khi click
window.buyBuilding = function(name, price, addIncome) {
    if (window.scoin >= price) {
        window.scoin -= price;
        window.income += addIncome;
        
        // Lưu dữ liệu ngay lập tức
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('income', window.income);

        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }

        alert("✅ Xây dựng thành công: " + name + "\nThu nhập của bạn đã tăng lên!");
        window.updateBuildUI();
    } else {
        alert("❌ Bạn cần thêm " + Math.floor(price - window.scoin).toLocaleString() + " SC để xây dựng!");
    }
};

// Cập nhật giao diện ngay khi mở tab
window.updateBuildUI();
