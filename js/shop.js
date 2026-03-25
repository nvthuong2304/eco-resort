window.renderShopUI = function() {
    if(document.getElementById('shop-scoin')) document.getElementById('shop-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');

    let shopHTML = "";
    for (let key in window.buildings) {
        let b = window.buildings[key];
        let nextPrice = Math.floor(b.basePrice * Math.pow(1.5, b.level));
        let btnText = b.level === 0 ? "Mua mới" : "Nâng cấp";
        
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
    if(document.getElementById('shop-list')) document.getElementById('shop-list').innerHTML = shopHTML;
};

window.upgradeBuilding = function(key) {
    let b = window.buildings[key];
    let price = Math.floor(b.basePrice * Math.pow(1.5, b.level));
    
    if (window.scoin >= price) {
        window.scoin -= price;
        b.level += 1;
        window.calcStats();
        
        // Lưu dữ liệu ngay lập tức
        localStorage.setItem('scoin', window.scoin);
        localStorage.setItem('buildings', JSON.stringify(window.buildings));
        
        window.showToast(`✅ Đã nâng cấp ${b.name} lên Cấp ${b.level}!`);
        window.renderShopUI(); // Tải lại danh sách cửa hàng
    } else {
        window.showToast(`❌ Thiếu ${Math.floor(price - window.scoin).toLocaleString('vi-VN')} Scoin!`);
    }
};

window.renderShopUI();
