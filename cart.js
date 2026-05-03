window.addEventListener("load", function () {

    const cartContainer = document.getElementById("cartItems");
    const totalPrice    = document.getElementById("totalPrice");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    function getImageUrl(imgFile) {
        if (!imgFile) return "https://via.placeholder.com/100";
        if (imgFile.startsWith("http")) return imgFile;
        return "http://localhost/KHAADI/backend/uploads/" + imgFile;
    }

    function loadCart() {
        fetch("http://localhost/KHAADI/backend/api/get_cart.php", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            cartContainer.innerHTML = "";

            if (data.status === "not_logged_in") {
                cartContainer.innerHTML = "<p style='text-align:center;padding:40px;'>Pehle login karein 🔒 <a href='../access/login.html'>Login</a></p>";
                if (totalPrice) totalPrice.innerText = "0";
                return;
            }

            const cart = data.cart || [];

            if (cart.length === 0) {
                cartContainer.innerHTML = "<p style='text-align:center;padding:40px;'>Cart khali hai 🛒</p>";
                if (totalPrice) totalPrice.innerText = "0";
                return;
            }

            let cartTotal = 0;

            cart.forEach(item => {
                let price    = Number(item.price) || 0;
                let qty      = Number(item.quantity) || 1;
                let subtotal = price * qty;
                cartTotal   += subtotal;

                cartContainer.innerHTML += `
                    <div class="cart-item" style="
                        display:flex;align-items:center;gap:15px;
                        padding:15px;margin:10px 0;
                        border:1px solid #ddd;border-radius:10px;background:#fff;">
                        <img src="${getImageUrl(item.image)}"
                            onerror="this.src='https://via.placeholder.com/100'"
                            style="width:90px;height:90px;object-fit:cover;border-radius:8px;">
                        <div style="flex:1;">
                            <h3 style="margin:0 0 5px;">${item.name}</h3>
                            <p style="color:#888;">Price: PKR ${price.toLocaleString()}</p>
                            <div style="display:flex;align-items:center;gap:10px;margin:8px 0;">
                                <button onclick="changeQty(${item.product_id}, ${qty - 1})" style="
                                    width:28px;height:28px;border:none;border-radius:50%;
                                    background:#f1c40f;font-weight:bold;cursor:pointer;font-size:16px;">-</button>
                                <span style="font-weight:bold;">${qty}</span>
                                <button onclick="changeQty(${item.product_id}, ${qty + 1})" style="
                                    width:28px;height:28px;border:none;border-radius:50%;
                                    background:#f1c40f;font-weight:bold;cursor:pointer;font-size:16px;">+</button>
                            </div>
                            <p style="font-weight:bold;">Subtotal: PKR ${subtotal.toLocaleString()}</p>
                        </div>
                        <button onclick="removeItem(${item.product_id})" style="
                            background:#e74c3c;color:#fff;border:none;
                            padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:bold;">
                            Remove
                        </button>
                    </div>
                `;
            });

            if (totalPrice) totalPrice.innerText = cartTotal.toLocaleString();
        })
        .catch(err => {
            console.error("Cart load error:", err);
            cartContainer.innerHTML = "<p style='color:red;text-align:center;padding:40px;'>Cart load nahi hui</p>";
        });
    }

    window.changeQty = function(productId, newQty) {
        if (newQty <= 0) { removeItem(productId); return; }
        fetch("http://localhost/KHAADI/backend/api/update_cart.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "product_id=" + productId + "&quantity=" + newQty
        })
        .then(res => res.json())
        .then(() => loadCart())
        .catch(console.error);
    }

    window.removeItem = function(productId) {
        fetch("http://localhost/KHAADI/backend/api/remove_cart.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "product_id=" + productId
        })
        .then(res => res.json())
        .then(() => loadCart())
        .catch(console.error);
    }

    // ================== PLACE ORDER ==================
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function () {

            // ✅ cust_ IDs — window.name conflict fix
            const name    = document.getElementById("cust_name").value.trim();
            const phone   = document.getElementById("cust_phone").value.trim();
            const address = document.getElementById("cust_address").value.trim();
            const email   = document.getElementById("cust_email").value.trim();

            if (!name || !phone || !address || !email) {
                alert("Sab fields bharain ❌");
                return;
            }

            const fd = new FormData();
            fd.append("name",    name);
            fd.append("phone",   phone);
            fd.append("address", address);
            fd.append("email",   email);

            fetch("http://localhost/KHAADI/backend/api/place_order.php", {
                method: "POST",
                credentials: "include",
                body: fd
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Order place ho gaya! 🎉\nTracking ID: " + data.tracking_id + "\nSave kar lain!");
                    loadCart();
                } else {
                    alert("Error: " + (data.message || data.msg));
                }
            })
            .catch(err => {
                console.error("Order error:", err);
                alert("Server error — dobara try karein");
            });
        });
    }

    loadCart();
});