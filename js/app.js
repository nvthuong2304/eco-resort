window.scoin = parseFloat(localStorage.getItem('scoin')) || 2000;
window.vndBalance = parseFloat(localStorage.getItem('vnd')) || 0;
window.income = parseFloat(localStorage.getItem('income')) || 0;
let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

const tg = window.Telegram.WebApp;
tg.expand();

// Hệ thống thông báo nổi (Toast)
window.showToast = function(msg) {
    if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    let t = document.createElement('div');
    t.className = 'toast-msg'; t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
};

// Thu nhập ngoại tuyến
let now = Date.now();
let offTime = Math.floor((now - lastLogin) / 1000);
if (offTime > 60 && window.income > 0) {
    let earned = (window.income / 3600) * offTime;
    window.scoin += earned;
    setTimeout(() => window.showToast(`👋 Bạn được cộng ${Math.floor(earned).toLocaleString()} SC ngoại tuyến!`), 1000);
}

// Điểm danh ngày
window.dailyCheckin = function() {
    let lastCheckin = localStorage.getItem('lastCheckin');
    let today = new Date().toDateString();
    if (lastCheckin === today) {
        window.showToast("⏳ Bạn đã điểm danh hôm nay rồi!");
        return;
    }
    window.scoin += 5000;
    localStorage.setItem('lastCheckin', today);
    window.showToast("🎁 Điểm danh thành công! +5,000 SC");
    if(window.updateBuildUI) window.updateBuildUI();
};

// Nhiệm vụ Telegram
window.joinTelegramTask = function() {
    let taskDone = localStorage.getItem('tgTaskDone');
    if (taskDone) {
        window.showToast("✅ Bạn đã làm nhiệm vụ này rồi!");
        return;
    }
    tg.openTelegramLink('https://t.me/telegram'); // Mở link Telegram
    setTimeout(() => {
        window.scoin += 10000;
        localStorage.setItem('tgTaskDone', 'true');
        window.showToast("🎉 Hoàn thành nhiệm vụ! +10,000 SC");
        loadTab('office'); // Tải lại trang để cập nhật số dư
    }, 4000);
};

// Chuyển Tab
function loadTab(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now())
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            const script = document.createElement('script');
            script.src = './js/' + tabName + '.js?v=' + Date.now();
            document.body.appendChild(script);
        }).catch(err => console.error(err));
}

// Vòng lặp Mining liên tục
if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        if (window.income > 0) {
            window.scoin += (window.income / 3600);
            if(window.updateBuildUI) window.updateBuildUI();
            if(document.getElementById('ex-scoin')) document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString();
        }
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('vnd', window.vndBalance);
        localStorage.setItem('income', window.income);
        localStorage.setItem('lastLogin', Date.now());
    }, 1000);
}

loadTab('build');
