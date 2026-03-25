if(document.getElementById('ex-scoin')) {
    document.getElementById('ex-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
}

window.calcVcoin = function() {
    let rawVal = document.getElementById('scoin-to-sell').value.replace(/[^0-9]/g, ''); 
    let val = parseInt(rawVal) || 0;
    document.getElementById('vcoin-preview').innerText = ((val / 1000) * 800).toLocaleString('vi-VN');
};

window.processExchange = function() {
    let rawVal = document.getElementById('scoin-to-sell').value.replace(/[^0-9]/g, '');
    let amount = parseInt(rawVal);
    
    if (isNaN(amount) || amount < 1000) {
        window.showToast("❌ Vui lòng nhập tối thiểu 1,000 Scoin!");
        return;
    }
    if (window.scoin >= amount) {
        let money = (amount / 1000) * 800;
        window.scoin -= amount;
        window.vcoin += money; 
        
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('vcoin', window.vcoin);
        
        window.showToast("✅ Đổi thành công " + money.toLocaleString('vi-VN') + " Vcoin!");
        window.loadTab('exchange'); 
    } else {
        window.showToast("❌ Không đủ Scoin để bán!");
    }
};
