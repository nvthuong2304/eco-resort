window.scoin = parseFloat(localStorage.getItem('scoin')) || 2000;
window.vndBalance = parseFloat(localStorage.getItem('vnd')) || 0;
window.income = parseFloat(localStorage.getItem('income')) || 0;
let lastLogin = parseInt(localStorage.getItem('lastLogin')) || Date.now();

const tg = window.Telegram.WebApp;
tg.expand();

// Thông báo nổi chuyên nghiệp
window.showToast = function(msg) {
    if(window.Telegram?.WebApp?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    let t = document.createElement('div');
    t.className = 'toast-msg'; t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
};

// Thu nhập ngoại tuyến (Offline Mining)
let now = Date.now();
let offTime = Math.floor((now - lastLogin) / 1000); // Tính bằng giây
if (offTime > 60 && window.income > 0) {
    let earned = (window.income / 3600) * offTime;
    window.scoin += earned;
    setTimeout(() => window.showToast(`👋 Chào mừng trở lại! Khu du lịch đã kiếm được ${Math.floor(earned).toLocaleString()} SC trong lúc bạn đi vắng.`), 1000);
}

// Chức năng Điểm danh
window.dailyCheckin = function() {
    let lastCheckin = localStorage.getItem('lastCheckin');
    let today = new Date().toDateString();
    if (lastCheckin === today) {
        window.showToast("⏳ Bạn đã nhận quà hôm nay rồi. Hãy quay lại vào ngày mai!");
        return;
    }
    window.scoin += 5000;
    localStorage.setItem('lastCheckin', today);
    window.showToast("🎁 Điểm danh thành công! Bạn nhận được +5,000 SC");
    if(window.updateBuildUI) window.updateBuildUI();
};

function loadTab(tabName) {
    fetch('./tabs/' + tabName + '.html?v=' + Date.now()) // Thêm query chống cache
        .then(res => res.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            const script = document.createElement('script');
            script.src = './js/' + tabName + '.js?v=' + Date.now();
            document.body.appendChild(script);
        }).catch(err => console.error(err));
}

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
        localStorage.setItem('lastLogin', Date.now()); // Liên tục lưu thời gian thực
    }, 1000);
}

loadTab('build');
