// Khởi tạo dữ liệu từ LocalStorage (Bộ nhớ máy)
// Nếu chơi lần đầu, cho sẵn 2000 Scoin
window.scoin = parseFloat(localStorage.getItem('scoin')) || 2000;
window.vndBalance = parseFloat(localStorage.getItem('vnd')) || 0;
window.income = parseFloat(localStorage.getItem('income')) || 0;

const tg = window.Telegram.WebApp;
tg.expand(); // Mở rộng ứng dụng toàn màn hình Telegram

// Hàm chuyển đổi Tab mượt mà
function loadTab(tabName) {
    // Thêm dấu chấm (.) trước /tabs để GitHub Pages hiểu đúng đường dẫn
    fetch('./tabs/' + tabName + '.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            
            // Nạp file JS xử lý riêng cho tab đó (nếu có)
            const script = document.createElement('script');
            script.src = './js/' + tabName + '.js?v=' + Date.now(); // Thêm version để tránh cache
            document.body.appendChild(script);
        })
        .catch(err => console.error("Lỗi khi tải tab:", err));
}

// Hệ thống Mining tự cộng tiền mỗi giây
if (!window.ecoInterval) {
    window.ecoInterval = setInterval(() => {
        if (window.income > 0) {
            // Lợi nhuận hàng giờ (income) được chia cho 3600 giây để cộng mỗi giây
            window.scoin += (window.income / 3600);
            
            // Cập nhật hiển thị Scoin ở Tab 'build' nếu người dùng đang ở tab đó
            if(document.getElementById('display-scoin')) {
                document.getElementById('display-scoin').innerText = Math.floor(window.scoin).toLocaleString();
            }
            // Cập nhật hiển thị Scoin ở Tab 'exchange' nếu người dùng đang ở tab đó
            if(document.getElementById('ex-scoin')) {
                document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString();
            }
        }
    }, 1000); // Vòng lặp chạy mỗi 1000ms (1 giây)
}

// Tự động lưu dữ liệu vào máy người dùng mỗi 2 giây
setInterval(() => {
    localStorage.setItem('scoin', window.scoin);
    localStorage.setItem('vnd', window.vndBalance);
    localStorage.setItem('income', window.income);
}, 2000);

// Mặc định load tab Xây dựng khi mở app
loadTab('build');
