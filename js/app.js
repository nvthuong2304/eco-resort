// Khởi tạo dữ liệu
window.scoin = parseFloat(localStorage.getItem('scoin')) || 2000;
window.vndBalance = parseFloat(localStorage.getItem('vnd')) || 0;
window.income = parseFloat(localStorage.getItem('income')) || 0;

const tg = window.Telegram.WebApp;
tg.expand();

function loadTab(tabName) {
    // Thêm dấu chấm (.) trước /tabs để GitHub hiểu đúng đường dẫn
    fetch('./tabs/' + tabName + '.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            
            const script = document.createElement('script');
            script.src = './js/' + tabName + '.js?v=' + Date.now();
            document.body.appendChild(script);
        })
        .catch(err => console.error("Lỗi:", err));
}

setInterval(() => {
    localStorage.setItem('scoin', window.scoin);
    localStorage.setItem('vnd', window.vndBalance);
    localStorage.setItem('income', window.income);
}, 2000);

loadTab('build');
