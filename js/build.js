window.renderHomeUI = function() {
    if(document.getElementById('home-scoin')) {
        document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    }
    if(document.getElementById('home-income')) {
        document.getElementById('home-income').innerText = window.income.toLocaleString('vi-VN');
    }
    
    let stars = "";
    for(let i=0; i<window.resortStars; i++) stars += "⭐";
    if(document.getElementById('star-display')) {
        document.getElementById('star-display').innerText = stars;
    }

    // Nạp danh sách đã sở hữu
    let ownedHTML = "";
    for (let key in window.buildings) {
        let b = window.buildings[key];
        if (b.level > 0) {
            ownedHTML += `
            <div class="grid-item">
                <div style="font-size: 30px;">${b.icon}</div>
                <h4>${b.name} <span style="color:${b.color}">Lv.${b.level}</span></h4>
                <p>+${(b.baseInc * b.level).toLocaleString('vi-VN')} SC/h</p>
            </div>`;
        }
    }
    if(ownedHTML === "") ownedHTML = `<p style="grid-column: span 2; text-align:center; color:#999; font-size: 13px;">Chưa có công trình nào. Hãy Mở Cửa Hàng!</p>`;
    
    if(document.getElementById('owned-grid')) {
        document.getElementById('owned-grid').innerHTML = ownedHTML;
    }

    // Nạp danh sách Cửa hàng
    let shopHTML = "";
    for (let key in window.buildings) {
        let b = window.buildings[key];
        let nextPrice = Math.floor(b.basePrice * Math.pow(1.5, b.level));
        let btnText = b.level === 0 ? "Mua" : "Nâng";
        
        shopHTML += `
        <div style="background: white; padding: 12px; border-radius: 12px; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #eee;">
            <div style="font-size: 30px; margin-right: 15px;">${b.icon}</div>
            <div style="flex-grow: 1;">
                <h4 style="margin:0 0 4px 0;">${b.name} <span style="font-size:11px; color:#666;">Lv.${b.level}</span></h4>
                <p style="margin:0; font-size: 11px; color: #10b981;">+${b.baseInc.toLocaleString('vi-VN')}/h (Mỗi cấp)</p>
            </div>
            <div style="text-align: right;">
                <b style="display: block; color: #e67e22; font-size: 13px; margin-bottom: 5px;">${nextPrice.toLocaleString('vi-VN')} SC</b>
                <button onclick="window.upgradeBuilding('${key}')" style="background: ${b.color}; color: white; padding: 6px 15px; font-size: 12px;">${btnText}</button>
            </div>
        </div>`;
    }
    if(document.getElementById('shop-list')) {
        document.getElementById('shop-list').innerHTML = shopHTML;
    }
};

window.upgradeBuilding = function(key) {
    let b = window.buildings[key];
    let price = Math.floor(b.basePrice * Math.pow(1.5, b.level));
    
    if (window.scoin >= price) {
        window.scoin -= price;
        b.level += 1;
        window.calcStats();
        window.showToast(`✅ Đã nâng cấp ${b.name} lên Cấp ${b.level}!`);
        window.renderHomeUI();
    } else {
        window.showToast(`❌ Thiếu ${Math.floor(price - window.scoin).toLocaleString('vi-VN')} Scoin!`);
    }
};

// Gọi hàm ngay lập tức khi mở tab
window.renderHomeUI();
