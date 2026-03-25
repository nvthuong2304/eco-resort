// Khởi tạo hệ thống dữ liệu phức tạp
window.scoin = parseFloat(localStorage.getItem('scoin')) || 500; // Vốn ban đầu 500 Scoin
window.vcoin = parseFloat(localStorage.getItem('vcoin')) || 0;
let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

// Dữ liệu toàn bộ công trình (Giá thấp hơn, thu nhập hợp lý hơn)
window.buildings = JSON.parse(localStorage.getItem('buildings')) || {
    'b1': { id: 'b1', name: 'Bungalow Gỗ', icon: '🏠', level: 0, basePrice: 100, baseInc: 10, color: '#f1c40f' },
    'b2': { id: 'b2', name: 'Nhà Hàng Biển', icon: '🍴', level: 0, basePrice: 500, baseInc: 60, color: '#e67e22' },
    'b3': { id: 'b3', name: 'Hồ Bơi Vô Cực', icon: '🌊', level: 0, basePrice: 1500, baseInc: 200, color: '#3498db' },
    'b4': { id: 'b4', name: 'Khu Thú Cảnh', icon: '🦌', level: 0, basePrice: 5000, baseInc: 750, color: '#9b59b6' },
    'b5': { id: 'b5', name: 'Bãi Trực Thăng', icon: '🚁', level: 0, basePrice: 20000, baseInc: 3500, color: '#e74c3c' }
};

const tg = window.Telegram.WebApp;
tg.expand();

// Tính tổng thu nhập và cấp độ Resort
window.calcStats = function() {
    let totalInc = 0;
    let totalLevel = 0;
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if(b.level > 0) {
            totalInc += b.baseInc * b.level;
            totalLevel += b.level;
        }
    }
    window.income = totalInc;
    window.resortStars = Math.floor(totalLevel / 3) + 1; // 3 cấp công trình = 1 sao
    if(window.resortStars > 5) window.resortStars = 5; // Tối đa 5 sao
};
window.calcStats();

window.showToast = function(msg) {
    if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    let t = document.createElement('div');
    t.className = 'toast-msg'; t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
};

// Mining ngoại tuyến
let offTime = Math.floor((Date.now() - lastLogin) / 1000);
if (offTime > 60 && window.income > 0) {
    let earned = (window.income / 3600) * offTime;
    window.scoin += earned;
    setTimeout(() => window.showToast(`👋 Ngoại tuyến: +${Math.floor(earned).toLocaleString()} Scoin!`), 1000);
}

window.loadTab = function(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now())
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
        }).catch(err => console.error(err));
};

// Mining mỗi giây
if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        if (window.income > 0) {
            window.scoin += (window.income / 3600);
            if(window.renderHomeUI) window.renderHomeUI();
            if(document.getElementById('ex-scoin')) document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString();
        }
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('vcoin', window.vcoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        localStorage.setItem('lastLogin', Date.now());
    }, 1000);
}

// Chức năng mời bạn bè
window.inviteFriends = function() {
    let botLink = "https://t.me/ECO_TOURISM_AREA_BOT/ecoresort";
    let text = "Hãy đến xây dựng Khu Nghỉ Dưỡng Sinh Thái cùng tôi và kiếm Vcoin nhé!";
    let shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
};

window.loadTab('build');
