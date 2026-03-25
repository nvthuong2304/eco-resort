window.renderHomeUI = function() {
    if(document.getElementById('home-scoin')) document.getElementById('home-scoin').innerText = Math.floor(window.scoin).toLocaleString('vi-VN');
    if(document.getElementById('home-income')) document.getElementById('home-income').innerText = window.income.toLocaleString('vi-VN');
    
    let stars = "";
    for(let i=0; i<window.resortStars; i++) stars += "⭐";
    if(document.getElementById('star-display')) document.getElementById('star-display').innerText = stars;

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
    
    if(document.getElementById('owned-grid')) document.getElementById('owned-grid').innerHTML = ownedHTML;
};

// Khởi chạy
window.renderHomeUI();
