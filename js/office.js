if(document.getElementById('off-vcoin')) {
    document.getElementById('off-vcoin').innerText = Math.floor(window.vcoin).toLocaleString();
}

window.joinTelegramTask = function() {
    let taskDone = localStorage.getItem('tgTaskDone');
    if (taskDone) {
        window.showToast("✅ Bạn đã làm nhiệm vụ này rồi!");
        return;
    }
    window.Telegram.WebApp.openTelegramLink('https://t.me/telegram');
    setTimeout(() => {
        window.scoin += 10000;
        localStorage.setItem('tgTaskDone', 'true');
        window.showToast("🎉 Hoàn thành nhiệm vụ! +10,000 Scoin");
        window.loadTab('office'); 
    }, 4000);
};

window.handleWithdraw = function() {
    let bank = document.getElementById('bank-name').value;
    let acc = document.getElementById('bank-acc').value;
    let val = parseInt(document.getElementById('draw-val').value);

    if (!bank || !acc || isNaN(val)) {
        window.showToast("❌ Vui lòng điền đầy đủ thông tin!");
        return;
    }
    if (val < 50000) {
        window.showToast("❌ Rút tối thiểu 50,000 Vcoin");
        return;
    }
    if (window.vcoin >= val) {
        window.vcoin -= val; // Trừ Vcoin
        window.showToast("🚀 Lệnh rút " + val.toLocaleString() + " Vcoin thành công!");
        window.loadTab('office');
    } else {
        window.showToast("❌ Số dư Vcoin không đủ!");
    }
};
