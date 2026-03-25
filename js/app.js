// Khởi tạo hệ thống dữ liệu
window.scoin = parseFloat(localStorage.getItem('scoin'));
if (isNaN(window.scoin)) window.scoin = 500;

window.vcoin = parseFloat(localStorage.getItem('vcoin'));
if (isNaN(window.vcoin)) window.vcoin = 0;

window.income = parseFloat(localStorage.getItem('income'));
if (isNaN(window.income)) window.income = 0;

let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

window.buildings = JSON.parse(localStorage.getItem('buildings')) || {
    'b1': { id: 'b1', name: 'Bungalow Gỗ', icon: '🏠', level: 0, basePrice: 100, baseInc: 10, color: '#f1c40f' },
    'b2': { id: 'b2', name: 'Nhà Hàng Biển', icon: '🍴', level: 0, basePrice: 500, baseInc: 60, color: '#e67e22' },
    'b3': { id: 'b3', name: 'Hồ Bơi Vô Cực', icon: '🌊', level: 0, basePrice: 1500, baseInc: 200, color: '#3498db' },
    'b4': { id: 'b4', name: 'Khu Thú Cảnh', icon: '🦌', level: 0, basePrice: 5000, baseInc: 750, color: '#9b59b6' },
    'b5': { id: 'b5', name: 'Bãi Trực Thăng', icon: '🚁', level: 0, basePrice: 20000, baseInc: 3500, color: '#e74c3c' }
};

const tg = window.Telegram.WebApp;
tg.expand();

// Hàm tính toán thu nhập
window.calcStats = function() {
    let totalInc = 0; let totalLevel = 0;
    for (let key in window.buildings) {
        if(window.buildings[key].level > 0) {
            totalInc += window.buildings[key].baseInc * window.buildings[key].level;
            totalLevel += window.buildings[key].level;
        }
    }
    window.income = totalInc;
    window.resortStars = Math.floor(totalLevel / 3) + 1;
    if(window.resortStars > 5) window.resortStars = 5;
};
window.calcStats();

// Hàm Thông báo nổi
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
    setTimeout(() => window.showToast(`👋 Ngoại tuyến: +${Math.floor(earned).toLocaleString('vi-VN')} Scoin!`), 1000);
}

// ==========================================
// GOM TOÀN BỘ LOGIC CỦA TRANG CHỦ VÀ CỬA HÀNG VÀO ĐÂY
// ==========================================

window.renderHomeUI = function() {
    if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    if(document.getElementById('home-income')) document.getElementById('home-income').innerText = window.income.toLocaleString('vi-VN');
    let stars = ""; for(let i=0; i<window.resortStars; i++) stars += "⭐";
    if(document.getElementById('star-display')) document.getElementById('star-display').innerText = stars;

    let ownedHTML = "";
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if (b.level > 0) {
            ownedHTML += `
            <div class="grid-item">
                <div style="font-size: 30px;">${b.icon}</div>
                <h4>${b.name} <span style="color:${b.color}">Lv.${b.level}</span></h4>
                <p>+${(b.baseInc * b.level).toLocaleString('vi-VN')} SC/h</p>
            </div>`;
        }
    }
    if(ownedHTML === "") ownedHTML = `<p style="grid-column: span 2; text-align:center; color:#999; font-size: 13px;">Chưa có công trình nào. Hãy vào Cửa Hàng!</p>`;
    if(document.getElementById('owned-grid')) document.getElementById('owned-grid').innerHTML = ownedHTML;
};

window.renderShopUI = function() {
    if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');

    let shopHTML = "";
    for (let key in window.buildings) {
        let b = window.buildings[key];
        let nextPrice = Math.floor(b.basePrice * Math.pow(1.5, b.level));
        let btnText = b.level === 0 ? "Mua mới" : "Nâng cấp";

        shopHTML += `
        <div style="background: white; padding: 12px; border-radius: 12px; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #eee; margin-bottom: 10px;">
            <div style="font-size: 30px; margin-right: 15px;">${b.icon}</div>
            <div style="flex-grow: 1;">
                <h4 style="margin:0 0 4px 0;">${b.name} <span style="font-size:11px; color:#666;">Lv.${b.level}</span></h4>
                <p style="margin:0; font-size: 11px; color: #10b981;">+${b.baseInc.toLocaleString('vi-VN')}/h (Mỗi cấp)</p>
            </div>
            <div style="text-align: right;">
                <b style="display: block; color: #e67e22; font-size: 13px; margin-bottom: 5px;">${nextPrice.toLocaleString('vi-VN')} SC</b>
                <button onclick="window.upgradeBuilding('${key}')" style="background: ${b.color}; color: white; padding: 6px 15px; font-size: 12px; border-radius: 8px; border:none; font-weight:bold;">${btnText}</button>
            </div>
        </div>`;
    }
    if(document.getElementById('shop-list')) document.getElementById('shop-list').innerHTML = shopHTML;
};

window.upgradeBuilding = function(key) {
    let b = window.buildings[key];
    let price = Math.floor(b.basePrice * Math.pow(1.5, b.level));

    if (window.scoin >= price) {
        window.scoin -= price;
        b.level += 1;
        window.calcStats();
        
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        
        window.showToast(`✅ Đã nâng cấp ${b.name} lên Cấp ${b.level}!`);
        window.renderShopUI();
    } else {
        window.showToast(`❌ Thiếu ${Math.floor(price - window.scoin).toLocaleString('vi-VN')} Scoin!`);
    }
};

// ==========================================
// HÀM CHUYỂN TAB CẢI TIẾN (Chống lỗi tải chậm)
// ==========================================

window.loadTab = function(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now())
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;

            // Đợi HTML nạp xong 50ms rồi gọi thẳng hàm hiển thị (100% không bị trắng trang)
            setTimeout(() => {
                if (tabName === 'build') window.renderHomeUI();
                if (tabName === 'shop') window.renderShopUI();
            }, 50);

            // Các tab khác thì mới cần load file js phụ
            if(tabName !== 'build' && tabName !== 'shop') {
                const script = document.createElement('script');
                script.src = './js/' + tabName + '.js?v=' + Date.now();
                document.body.appendChild(script);
            }
        }).catch(err => console.error(err));
};

// Hệ thống đếm giờ Mining tự động
if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        if (window.income > 0) {
            window.scoin += (window.income / 3600);
            if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
            if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
            if(document.getElementById('ex-scoin')) document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
        }
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('vcoin', window.vcoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        localStorage.setItem('lastLogin', Date.now());
    }, 1000);
}

// Nút mời bạn bè
window.inviteFriends = function() {
    let botLink = "https://t.me/ECO_TOURISM_AREA_BOT/ecoresort";
    let text = "Hãy đến xây dựng Khu Nghỉ Dưỡng Sinh Thái cùng tôi và kiếm Vcoin nhé!";
    let shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
};

// Khởi chạy mặc định
window.loadTab('build');
