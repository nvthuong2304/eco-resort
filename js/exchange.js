// Giả định số dư VNĐ (sau này lưu vào LocalStorage)
let vndBalance = 0;

function sellScoin() {
    let amount = parseInt(document.getElementById('sc-to-sell').value);
    let msg = document.getElementById('exchange-msg');
    
    // Kiểm tra xem scoin có đủ không (biến scoin được thừa kế từ app)
    if (isNaN(amount) || amount < 1000) {
        msg.innerText = "❌ Tối thiểu phải bán 1,000 SC!";
        msg.style.color = "red";
        return;
    }

    if (scoin >= amount) {
        let earnedVnd = (amount / 1000) * 800;
        scoin -= amount; // Trừ Scoin
        vndBalance += earnedVnd; // Cộng VNĐ
        
        msg.innerText = "✅ Bạn đã đổi thành công " + earnedVnd.toLocaleString() + " VNĐ";
        msg.style.color = "green";
        
        // Cập nhật hiển thị nếu có
        if(typeof updateDisplay === "function") updateDisplay();
        
        // Lưu lại vào bộ nhớ máy (LocalStorage)
        localStorage.setItem('scoin', scoin);
        localStorage.setItem('vnd', vndBalance);
    } else {
        msg.innerText = "❌ Bạn không đủ Scoin!";
        msg.style.color = "red";
    }
}
