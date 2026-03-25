// Tải dữ liệu cũ từ máy người dùng lên
let scoin = parseInt(localStorage.getItem('scoin')) || 2000;
let vndBalance = parseInt(localStorage.getItem('vnd')) || 0;
let income = parseInt(localStorage.getItem('income')) || 0;

// Mỗi 5 giây tự động lưu một lần
setInterval(() => {
    localStorage.setItem('scoin', scoin);
    localStorage.setItem('vnd', vndBalance);
    localStorage.setItem('income', income);
}, 5000);
const tg = window.Telegram.WebApp;
tg.expand();

// Hàm chuyển tab
function loadTab(tabName) {
    fetch('tabs/' + tabName + '.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            
            // Tự động nạp file JS tương ứng với tab
            const script = document.createElement('script');
            script.src = 'js/' + tabName + '.js';
            document.body.appendChild(script);
        })
        .catch(err => console.error("Lỗi tải tab:", err));
}

// Mặc định load tab Xây dựng khi mở app
loadTab('build');
