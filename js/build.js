window.updateBuildUI = function() {
    if (document.getElementById('display-scoin')) {
        document.getElementById('display-scoin').innerText = Math.floor(window.scoin).toLocaleString();
    }
    if (document.getElementById('display-income')) {
        document.getElementById('display-income').innerText = window.income.toLocaleString();
    }
    if (document.getElementById('resort-level')) {
        document.getElementById('resort-level').innerText = "Cấp " + (Math.floor(window.income / 1000) + 1);
    }
};

window.buyBuilding = function(name, price, addIncome) {
    if (window.scoin >= price) {
        window.scoin -= price;
        window.income += addIncome;
        
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('income', window.income);

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }

        alert("✅ Xây dựng thành công: " + name);
        window.updateBuildUI();
    } else {
        alert("❌ Bạn cần thêm " + Math.floor(price - window.scoin).toLocaleString() + " SC!");
    }
};

window.updateBuildUI();
