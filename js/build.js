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
        
        window.showToast("🏗️ Đã xây xong " + name + "!");
        window.updateBuildUI();
    } else {
        window.showToast("❌ Thiếu " + Math.floor(price - window.scoin).toLocaleString() + " SC!");
    }
};

window.updateBuildUI();
