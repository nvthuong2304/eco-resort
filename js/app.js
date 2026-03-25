// Khởi tạo hệ thống dữ liệu
window.scoin = parseFloat(localStorage.getItem('scoin'));
if (isNaN(window.scoin)) window.scoin = 500;

window.vcoin = parseFloat(localStorage.getItem('vcoin'));
if (isNaN(window.vcoin)) window.vcoin = 0;

window.income = parseFloat(localStorage.getItem('income'));
if (isNaN(window.income)) window.income = 0;

let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

// Đổi tên Bungalow thành Nhà Gỗ
window.buildings = JSON.parse(localStorage.getItem('buildings')) || {
    'b1': { id: 'b1', name: 'Nhà Gỗ', icon: '🏠', level: 0, basePrice: 100, baseInc: 10, color: '#f1c40f', upgradeEnd: 0 },
    'b2': { id: 'b2', name: 'Nhà Hàng Biển', icon: '🍴', level: 0, basePrice: 500, baseInc: 60, color: '#e67e22', upgradeEnd: 0 },
    'b3': { id: 'b3', name: 'Hồ Bơi Vô Cực', icon: '🌊', level: 0, basePrice: 1500, baseInc: 200, color: '#3498db', upgradeEnd: 0 },
    'b4': { id: 'b4', name: 'Khu Thú Cảnh', icon: '🦌', level: 0, basePrice: 5000, baseInc: 750, color: '#9b59b6', upgradeEnd: 0 },
    'b5': { id: 'b5', name: 'Bãi Trực Thăng', icon: '🚁', level: 0, basePrice: 20000, baseInc: 3500, color: '#e74c3c', upgradeEnd: 0 }
};

const tg = window.Telegram.WebApp;
tg.expand();

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

window.showToast = function(msg) {
    if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    let t = document.createElement('div');
    t.className = 'toast-msg'; t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
};

let offTime = Math.floor((Date.now() - lastLogin) / 1000);
if (offTime > 60 && window.income > 0) {
    let earned = (window.income / 3600) * offTime;
    window.scoin += earned;
    setTimeout(() => window.showToast(`👋 Ngoại tuyến: +${Math.floor(earned).toLocaleString('vi-VN')} Scoin!`), 1000);
}

// ==========================================
// GIAO DIỆN VÀ LOGIC MUA SẮM
// ==========================================

window.renderHomeUI = function() {
    if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    if(document.getElementById('home-income')) document.getElementById('home-income').innerText = window.income.toLocaleString('vi-VN');
    let stars = ""; for(let i=0; i<window.resortStars; i++) stars += "⭐";
    if(document.getElementById('star-display')) document.getElementById('star-display').innerText = stars;

    let ownedHTML = "";
    let now = Date.now();
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if (b.level > 0) {
            let statusHTML = (b.upgradeEnd && b.upgradeEnd > now) ? `<span style="color:#e74c3c; font-size:10px;">(Đang thi công...)</span>` : "";
            ownedHTML += `
            <div class="grid-item">
                <div style="font-size: 30px;">${b.icon}</div>
                <h4>${b.name} <span style="color:${b.color}">Lv.${b.level}</span></h4>
                <p>+${(b.baseInc * b.level).toLocaleString('vi-VN')} SC/h<br>${statusHTML}</p>
            </div>`;
        }
    }
    if(ownedHTML === "") ownedHTML = `<p style="grid-column: span 2; text-align:center; color:#999; font-size: 13px;">Chưa có công trình nào. Hãy vào Cửa Hàng!</p>`;
    if(document.getElementById('owned-grid')) document.getElementById('owned-grid').innerHTML = ownedHTML;
};

window.renderShopUI = function() {
    if(!document.getElementById('shop-list')) return;
    if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');

    let shopHTML = "";
    let now = Date.now();
    
    for (let key in window.buildings) {
        let b = window.buildings[key];
        let nextPrice = Math.floor(b.basePrice * Math.pow(1.5, b.level));
        let isUpgrading = (b.upgradeEnd && b.upgradeEnd > now);
        
        let actionHTML = "";
        if (isUpgrading) {
            let timeLeft = Math.ceil((b.upgradeEnd - now) / 1000);
            let instantCost = timeLeft * 5; // 5 Scoin = 1 Giây
            let min = Math.floor(timeLeft/60);
            let sec = timeLeft%60;
            actionHTML = `
                <div id="time-${key}" style="font-size: 11px; color: #e74c3c; font-weight: bold; margin-bottom: 5px;">⏳ ${min}:${sec < 10 ? '0':''}${sec}</div>
                <button id="btn-instant-${key}" onclick="window.instantFinish('${key}')" style="background: #f1c40f; color: black; padding: 6px 12px; font-size: 11px; border-radius: 8px; border:none; font-weight:bold; cursor:pointer; box-shadow: 0 2px 0 #d4ac0d;">
                    ⚡ ${instantCost.toLocaleString('vi-VN')} SC
                </button>
            `;
        } else {
            let btnText = b.level === 0 ? "Mua mới" : "Nâng cấp";
            actionHTML = `
                <b style="display: block; color: #e67e22; font-size: 13px; margin-bottom: 5px;">${nextPrice.toLocaleString('vi-VN')} SC</b>
                <button onclick="window.upgradeBuilding('${key}')" style="background: ${b.color}; color: white; padding: 6px 15px; font-size: 12px; border-radius: 8px; border:none; font-weight:bold; cursor:pointer;">${btnText}</button>
            `;
        }

        shopHTML += `
        <div style="background: white; padding: 12px; border-radius: 12px; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #eee; margin-bottom: 10px;">
            <div style="font-size: 30px; margin-right: 15px;">${b.icon}</div>
            <div style="flex-grow: 1;">
                <h4 style="margin:0 0 4px 0;">${b.name} <span style="font-size:11px; color:#666;">Lv.${b.level}</span></h4>
                <p style="margin:0; font-size: 11px; color: #10b981;">+${b.baseInc.toLocaleString('vi-VN')}/h (Mỗi cấp)</p>
            </div>
            <div style="text-align: right; min-width: 85px;">
                ${actionHTML}
            </div>
        </div>`;
    }
    document.getElementById('shop-list').innerHTML = shopHTML;
};

// Bắt đầu nâng cấp
window.upgradeBuilding = function(key) {
    let b = window.buildings[key];
    let price = Math.floor(b.basePrice * Math.pow(1.5, b.level));

    if (window.scoin >= price) {
        window.scoin -= price;
        // Thời gian: 2 phút (120s) nhân với 1.5^level
        let waitTimeSeconds = Math.floor(120 * Math.pow(1.5, b.level));
        b.upgradeEnd = Date.now() + (waitTimeSeconds * 1000);
        
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        
        window.showToast(`⏳ Bắt đầu thi công ${b.name}!`);
        window.renderShopUI();
    } else {
        window.showToast(`❌ Thiếu ${Math.floor(price - window.scoin).toLocaleString('vi-VN')} Scoin!`);
    }
};

// Hoàn thành ngay lập tức
window.instantFinish = function(key) {
    let b = window.buildings[key];
    let now = Date.now();
    
    if (b.upgradeEnd && b.upgradeEnd > now) {
        let timeLeft = Math.ceil((b.upgradeEnd - now) / 1000);
        let cost = timeLeft * 5; // 5 Scoin cho 1 giây
        
        if (window.scoin >= cost) {
            window.scoin -= cost;
            b.level += 1;
            b.upgradeEnd = 0;
            window.calcStats();
            
            localStorage.setItem('scoin', window.scoin);
            localStorage.setItem('buildings', JSON.stringify(window.buildings));
            
            window.showToast(`⚡ Đã đập tiền hoàn thành ${b.name} Lv.${b.level}!`);
            window.renderShopUI();
            if(document.getElementById('home-scoin')) window.renderHomeUI();
        } else {
            window.showToast(`❌ Thiếu ${Math.floor(cost - window.scoin).toLocaleString('vi-VN')} Scoin để xong ngay!`);
        }
    }
};

window.loadTab = function(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now())
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            setTimeout(() => {
                if (tabName === 'build') window.renderHomeUI();
                if (tabName === 'shop') window.renderShopUI();
            }, 50);
            if(tabName !== 'build' && tabName !== 'shop') {
                const script = document.createElement('script');
                script.src = './js/' + tabName + '.js?v=' + Date.now();
                document.body.appendChild(script);
            }
        }).catch(err => console.error(err));
};

// Vòng lặp đếm giây
if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        let now = Date.now();
        let upgradeFinished = false;

        if (window.income > 0) window.scoin += (window.income / 3600);

        for (let key in window.buildings) {
            let b = window.buildings[key];
            if (b.upgradeEnd && b.upgradeEnd > 0 && now >= b.upgradeEnd) {
                b.level += 1;
                b.upgradeEnd = 0; 
                upgradeFinished = true;
                window.showToast(`🎉 Xây dựng thành công ${b.name} (Lv.${b.level})!`);
            }
        }

        if (upgradeFinished) {
            window.calcStats();
            if(document.getElementById('owned-grid')) window.renderHomeUI();
            if(document.getElementById('shop-list')) window.renderShopUI();
        }

        // Cập nhật đồng hồ và giá tiền Xong Ngay
        if(document.getElementById('shop-list')) {
            if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
            for (let key in window.buildings) {
                let b = window.buildings[key];
                if (b.upgradeEnd && b.upgradeEnd > now) {
                    let timeLeft = Math.ceil((b.upgradeEnd - now) / 1000);
                    let min = Math.floor(timeLeft/60);
                    let sec = timeLeft%60;
                    
                    let timeEl = document.getElementById(`time-${key}`);
                    if (timeEl) timeEl.innerText = `⏳ ${min}:${sec < 10 ? '0':''}${sec}`;
                    
                    let btnEl = document.getElementById(`btn-instant-${key}`);
                    if (btnEl) btnEl.innerText = `⚡ ${(timeLeft * 5).toLocaleString('vi-VN')} SC`;
                }
            }
        }

        if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
        if(document.getElementById('ex-scoin')) document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');

        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('vcoin', window.vcoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        localStorage.setItem('lastLogin', now);
    }, 1000);
}

window.inviteFriends = function() {
    let botLink = "https://t.me/ECO_TOURISM_AREA_BOT/ecoresort";
    let text = "Chơi Eco Resort nhận ngay 1000 Scoin và chia sẻ hoa hồng 3 tầng (F1 5%, F2 1%, F3 0.3%) cực khủng! Tham gia ngay:";
    let shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
};

window.loadTab('build');
