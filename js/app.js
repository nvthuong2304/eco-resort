window.scoin = parseFloat(localStorage.getItem('scoin')); if (isNaN(window.scoin)) window.scoin = 500;
window.vcoin = parseFloat(localStorage.getItem('vcoin')); if (isNaN(window.vcoin)) window.vcoin = 0;
window.income = parseFloat(localStorage.getItem('income')); if (isNaN(window.income)) window.income = 0;
window.claimedStarLevel = parseInt(localStorage.getItem('claimedStarLevel')) || 0;
let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

// Cập nhật tên mới và thời gian chuẩn (Ép lấy Level từ máy cũ, thông số từ Code mới)
let savedData = JSON.parse(localStorage.getItem('buildings')) || {};
window.buildings = {
    'b1': { id: 'b1', name: 'Khách sạn', icon: '🏠', level: savedData.b1?.level || 0, basePrice: 100, baseInc: 10, baseTime: 10, color: '#f1c40f', upgradeEnd: savedData.b1?.upgradeEnd || 0 },
    'b2': { id: 'b2', name: 'Nhà Hàng Biển', icon: '🍴', level: savedData.b2?.level || 0, basePrice: 500, baseInc: 60, baseTime: 60, color: '#e67e22', upgradeEnd: savedData.b2?.upgradeEnd || 0 },
    'b3': { id: 'b3', name: 'Hồ Bơi Vô Cực', icon: '🌊', level: savedData.b3?.level || 0, basePrice: 1500, baseInc: 200, baseTime: 120, color: '#3498db', upgradeEnd: savedData.b3?.upgradeEnd || 0 },
    'b4': { id: 'b4', name: 'Khu Thú Cảnh', icon: '🦌', level: savedData.b4?.level || 0, basePrice: 5000, baseInc: 750, baseTime: 450, color: '#9b59b6', upgradeEnd: savedData.b4?.upgradeEnd || 0 },
    'b5': { id: 'b5', name: 'Bãi đậu xe', icon: '🚙', level: savedData.b5?.level || 0, basePrice: 20000, baseInc: 3500, baseTime: 2100, color: '#e74c3c', upgradeEnd: savedData.b5?.upgradeEnd || 0 }
};

const tg = window.Telegram.WebApp;
tg.expand();

// TÍNH TOÁN CẤP TỔNG THỂ VÔ HẠN (Lấy Level thấp nhất trong 5 công trình)
window.calcStats = function() {
    let totalInc = 0; 
    let minLevel = Infinity;
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if(b.level > 0) totalInc += b.baseInc * b.level;
        if(b.level < minLevel) minLevel = b.level;
    }
    window.income = totalInc;
    window.resortStars = minLevel === Infinity ? 0 : minLevel;
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

// NHẬN THƯỞNG CẤP TỔNG THỂ
window.claimStarReward = function() {
    let nextLvl = window.claimedStarLevel + 1;
    if (window.resortStars >= nextLvl) {
        let reward = Math.floor(5000 * Math.pow(1.5, nextLvl - 1));
        window.scoin += reward;
        window.claimedStarLevel = nextLvl;
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('claimedStarLevel', window.claimedStarLevel);
        window.showToast(`🎉 Nhận thành công ${reward.toLocaleString('vi-VN')} Scoin cho Cấp ${nextLvl}⭐!`);
        window.renderHomeUI();
    } else {
        window.showToast(`❌ Bạn cần nâng TẤT CẢ công trình lên tối thiểu cấp ${nextLvl} để nhận thưởng!`);
    }
};

// ======================= CÁC HÀM RENDER UI =======================

window.renderHomeUI = function() {
    if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    if(document.getElementById('home-income')) document.getElementById('home-income').innerText = window.income.toLocaleString('vi-VN');
    if(document.getElementById('star-display')) document.getElementById('star-display').innerText = window.resortStars + "⭐";

    // Nút nhận thưởng thăng cấp
    let nextLvl = window.claimedStarLevel + 1;
    let rewardAmt = Math.floor(5000 * Math.pow(1.5, nextLvl - 1));
    let canClaim = window.resortStars >= nextLvl;
    if(document.getElementById('reward-btn')) {
        document.getElementById('reward-btn').innerText = canClaim ? `🎁 Nhận ${rewardAmt.toLocaleString('vi-VN')} SC` : `🎁 Cấp ${nextLvl} thưởng ${rewardAmt.toLocaleString('vi-VN')} SC`;
        document.getElementById('reward-btn').style.background = canClaim ? '#27ae60' : '#95a5a6';
    }

    let ownedHTML = ""; let now = Date.now();
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if (b.level > 0) {
            let statusHTML = (b.upgradeEnd && b.upgradeEnd > now) ? `<span style="color:#e74c3c; font-weight:bold;">(Đang thi công)</span>` : "";
            ownedHTML += `<div class="grid-item"><div style="font-size: 30px;">${b.icon}</div><h4>${b.name} <span style="color:${b.color}">Lv.${b.level}</span></h4><p>+${(b.baseInc * b.level).toLocaleString('vi-VN')} SC/h<br>${statusHTML}</p></div>`;
        }
    }
    if(ownedHTML === "") ownedHTML = `<p style="grid-column: span 2; text-align:center; color:#999; font-size: 13px;">Chưa có công trình nào. Hãy vào Cửa Hàng!</p>`;
    if(document.getElementById('owned-grid')) document.getElementById('owned-grid').innerHTML = ownedHTML;
};

window.renderShopUI = function() {
    if(!document.getElementById('shop-list')) return;
    if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');

    let shopHTML = ""; let now = Date.now();
    for (let key in window.buildings) {
        let b = window.buildings[key];
        let nextPrice = Math.floor(b.basePrice * Math.pow(1.5, b.level));
        let isUpgrading = (b.upgradeEnd && b.upgradeEnd > now);
        
        let actionHTML = "";
        if (isUpgrading) {
            let timeLeft = Math.ceil((b.upgradeEnd - now) / 1000);
            let instantCost = timeLeft * 5; 
            let min = Math.floor(timeLeft/60); let sec = timeLeft%60;
            actionHTML = `<div id="time-${key}" style="font-size: 11px; color: #e74c3c; font-weight: bold; margin-bottom: 5px;">⏳ ${min}:${sec < 10 ? '0':''}${sec}</div><button onclick="window.instantFinish('${key}')" style="background: #f1c40f; color: black; padding: 6px 12px; font-size: 11px; border-radius: 8px; border:none; font-weight:bold;">⚡ ${instantCost.toLocaleString('vi-VN')} SC</button>`;
        } else {
            let btnText = b.level === 0 ? "Mua mới" : "Nâng cấp";
            actionHTML = `<b style="display: block; color: #e67e22; font-size: 13px; margin-bottom: 5px;">${nextPrice.toLocaleString('vi-VN')} SC</b><button onclick="window.upgradeBuilding('${key}')" style="background: ${b.color}; color: white; padding: 6px 15px; font-size: 12px; border-radius: 8px; border:none; font-weight:bold;">${btnText}</button>`;
        }
        shopHTML += `<div style="background: white; padding: 12px; border-radius: 12px; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #eee; margin-bottom: 10px;"><div style="font-size: 30px; margin-right: 15px;">${b.icon}</div><div style="flex-grow: 1;"><h4 style="margin:0 0 4px 0;">${b.name} <span style="font-size:11px; color:#666;">Lv.${b.level}</span></h4><p style="margin:0; font-size: 11px; color: #10b981;">+1,5 lần mỗi cấp</p></div><div style="text-align: right; min-width: 85px;">${actionHTML}</div></div>`;
    }
    document.getElementById('shop-list').innerHTML = shopHTML;
};

// Giao diện Quy đổi
window.renderExchangeUI = function() {
    if(document.getElementById('ex-scoin-bal')) document.getElementById('ex-scoin-bal').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    if(document.getElementById('ex-vcoin-bal')) document.getElementById('ex-vcoin-bal').innerText = Math.floor(window.vcoin).toLocaleString('vi-VN');
};

// Giao diện Văn phòng
window.renderOfficeUI = function() {
    if(document.getElementById('off-vcoin')) document.getElementById('off-vcoin').innerText = Math.floor(window.vcoin).toLocaleString('vi-VN');
};

// ======================= LOGIC MUA BÁN & QUY ĐỔI =======================

window.upgradeBuilding = function(key) {
    let b = window.buildings[key];
    let price = Math.floor(b.basePrice * Math.pow(1.5, b.level));
    if (window.scoin >= price) {
        window.scoin -= price;
        let waitTimeSeconds = Math.floor(b.baseTime * Math.pow(1.5, b.level));
        b.upgradeEnd = Date.now() + (waitTimeSeconds * 1000);
        window.showToast(`⏳ Thi công ${b.name}! Hoàn thành sau ${waitTimeSeconds} giây.`);
        window.renderShopUI();
    } else window.showToast("❌ Thiếu Scoin!");
};

window.instantFinish = function(key) {
    let b = window.buildings[key];
    let now = Date.now();
    if (b.upgradeEnd && b.upgradeEnd > now) {
        let timeLeft = Math.ceil((b.upgradeEnd - now) / 1000);
        let cost = timeLeft * 5; 
        if (window.scoin >= cost) {
            window.scoin -= cost; b.level += 1; b.upgradeEnd = 0;
            window.calcStats(); window.showToast(`⚡ Đã đập tiền hoàn thành ${b.name}!`);
            window.renderShopUI();
        } else window.showToast("❌ Thiếu Scoin để xong ngay!");
    }
};

window.sellScoin = function() {
    let raw = document.getElementById('sell-scoin-input').value.replace(/[^0-9]/g, '');
    let val = parseInt(raw);
    if (isNaN(val) || val < 10) return window.showToast("❌ Tối thiểu 10 Scoin!");
    if (window.scoin >= val) {
        window.scoin -= val; window.vcoin += Math.floor(val / 10);
        window.showToast("✅ Quy đổi thành công!");
        document.getElementById('sell-scoin-input').value = ""; window.renderExchangeUI();
    } else window.showToast("❌ Không đủ Scoin!");
};

window.buyScoin = function() {
    let raw = document.getElementById('buy-vcoin-input').value.replace(/[^0-9]/g, '');
    let val = parseInt(raw);
    if (isNaN(val) || val < 1) return window.showToast("❌ Tối thiểu 1 Vcoin!");
    if (window.vcoin >= val) {
        window.vcoin -= val; window.scoin += (val * 10);
        window.showToast("✅ Quy đổi thành công!");
        document.getElementById('buy-vcoin-input').value = ""; window.renderExchangeUI();
    } else window.showToast("❌ Không đủ Vcoin!");
};

window.calcSell = function() {
    let val = parseInt(document.getElementById('sell-scoin-input').value.replace(/[^0-9]/g, '')) || 0;
    document.getElementById('sell-preview').innerText = Math.floor(val / 10).toLocaleString('vi-VN');
};
window.calcBuy = function() {
    let val = parseInt(document.getElementById('buy-vcoin-input').value.replace(/[^0-9]/g, '')) || 0;
    document.getElementById('buy-preview').innerText = (val * 10).toLocaleString('vi-VN');
};

// ======================= HỆ THỐNG VÀ CHUYỂN TAB =======================

window.loadTab = function(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now())
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            setTimeout(() => {
                if (tabName === 'build') window.renderHomeUI();
                if (tabName === 'shop') window.renderShopUI();
                if (tabName === 'exchange') window.renderExchangeUI();
                if (tabName === 'office') window.renderOfficeUI();
            }, 50);
        }).catch(err => console.error(err));
};

if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        let now = Date.now();
        let upgradeFinished = false;
        if (window.income > 0) window.scoin += (window.income / 3600);

        for (let key in window.buildings) {
            let b = window.buildings[key];
            if (b.upgradeEnd && b.upgradeEnd > 0 && now >= b.upgradeEnd) {
                b.level += 1; b.upgradeEnd = 0; upgradeFinished = true;
                window.showToast(`🎉 Xây dựng thành công ${b.name} (Lv.${b.level})!`);
            }
        }
        if (upgradeFinished) {
            window.calcStats();
            if(document.getElementById('owned-grid')) window.renderHomeUI();
            if(document.getElementById('shop-list')) window.renderShopUI();
        }

        if(document.getElementById('shop-list')) {
            if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
            for (let key in window.buildings) {
                let b = window.buildings[key];
                if (b.upgradeEnd && b.upgradeEnd > now) {
                    let timeEl = document.getElementById(`time-${key}`);
                    if (timeEl) {
                        let t = Math.ceil((b.upgradeEnd - now)/1000);
                        timeEl.innerText = `⏳ ${Math.floor(t/60)}:${t%60<10?'0':''}${t%60}`;
                        let btnEl = timeEl.nextElementSibling;
                        if(btnEl) btnEl.innerText = `⚡ ${(t*5).toLocaleString('vi-VN')} SC`;
                    }
                }
            }
        }

        if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
        if(document.getElementById('ex-scoin-bal')) document.getElementById('ex-scoin-bal').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
        
        localStorage.setItem('scoin', window.scoin); localStorage.setItem('vcoin', window.vcoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings)); localStorage.setItem('lastLogin', now);
    }, 1000);
}

window.inviteFriends = function() {
    let botLink = "https://t.me/ECO_TOURISM_AREA_BOT/ecoresort";
    let text = "Chơi Eco Resort nhận ngay 1000 Scoin và chia sẻ hoa hồng 3 tầng (F1 5%, F2 1%, F3 0.3%) cực khủng! Tham gia ngay:";
    let shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botLink)}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
};

window.loadTab('build');
