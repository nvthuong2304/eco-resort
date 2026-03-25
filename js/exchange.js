if(document.getElementById('ex-scoin')) {
    document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString();
}

window.calcVcoin = function() {
    let val = document.getElementById('scoin-to-sell').value || 0;
    document.getElementById('vcoin-preview').innerText = ((val / 1000) * 800).toLocaleString();
};

window.processExchange = function() {
    let amount = parseInt(document.getElementById('scoin-to-sell').value);
    if (isNaN(amount) || amount < 1000) {
        window.showToast("❌ Vui lòng nhập tối thiểu 1,000 Scoin!");
        return;
    }
    if (window.scoin >= amount) {
        let money = (amount / 1000) * 800;
        window.scoin -= amount;
        window.vcoin += money; // Cộng Vcoin
        window.showToast("✅ Đổi thành công " + money.toLocaleString() + " Vcoin!");
        window.loadTab('exchange'); // Tải lại trang để cập nhật số dư
    } else {
        window.showToast("❌ Không đủ Scoin để bán!");
    }
};
