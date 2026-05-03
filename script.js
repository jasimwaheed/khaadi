// ================== GLOBAL STATE ==================
let products  = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ================== IMAGE HELPER ==================
function getImageUrl(imgFile) {
    if (!imgFile) return "https://via.placeholder.com/300";
    if (typeof imgFile === "object") imgFile = imgFile.image || "";
    if (imgFile.startsWith("http")) return imgFile;
    return "http://localhost/KHAADI/backend/uploads/" + imgFile;
}

// ================== ADD TO CART ==================
function addToCart(productId) {

    fetch("http://localhost/KHAADI/backend/api/add_to_cart.php", {
        method: "POST",
        credentials: "include", // 🔥 MUST FOR SESSION
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded" 
        },
        body: "product_id=" + encodeURIComponent(productId) + "&quantity=1"
    })
    .then(res => res.json())
    .then(data => {

        console.log("CART RESPONSE:", data);

        if (data.status === "added" || data.status === "updated") {
            showToast("✅ Cart mein add ho gaya!");
            updateCartCount();

        } 
        else if (data.status === "not_logged_in") {
            localStorage.setItem("redirectAfterLogin", "cart");
            window.location.href = "http://localhost/KHAADI/frontend/access/login.html";
        } 
        else {
            alert(data.msg || "Unknown error");
        }
    })
    .catch(err => {
        console.error("Cart error:", err);
        alert("Server error");
    });
}

// ================== VIEW DETAILS ==================
function showProductDetails(id) {
    const product = products.find(p => p.id == id);
    if (!product) { console.error("Product nahi mila ID:", id); return; }

    let modal = document.getElementById("details-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "details-modal";
        document.body.appendChild(modal);
    }

    // saari images collect karo
    let allImages = [];
    if (product.image) allImages.push(getImageUrl(product.image));
    if (product.extra_images && product.extra_images.length > 0)
        product.extra_images.forEach(img => allImages.push(getImageUrl(img)));
    if (allImages.length === 0) allImages.push("https://via.placeholder.com/300");

    let thumbsHtml = allImages.length > 1 ? allImages.map((img, idx) => `
        <img src="${img}"
            onclick="document.getElementById('modal-main-img').src=this.src"
            style="width:60px;height:60px;object-fit:cover;border-radius:6px;
            cursor:pointer;border:2px solid #eee;margin:3px;"
            onerror="this.src='https://via.placeholder.com/60'">
    `).join("") : "";

    modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.85);display:flex;
        justify-content:center;align-items:center;z-index:9999;
        overflow-y:auto;padding:20px;box-sizing:border-box;
    `;

    modal.innerHTML = `
        <div style="background:#fff;padding:30px;border-radius:14px;
            max-width:500px;width:100%;text-align:center;position:relative;
            box-shadow:0 20px 60px rgba(0,0,0,0.4);">

            <button onclick="document.getElementById('details-modal').style.display='none'"
                style="position:absolute;top:12px;right:15px;background:#f1c40f;
                border:none;font-size:18px;cursor:pointer;border-radius:50%;
                width:32px;height:32px;font-weight:bold;">✕</button>

            <img id="modal-main-img" src="${allImages[0]}"
                style="width:100%;max-height:320px;object-fit:cover;
                border-radius:10px;margin-bottom:12px;"
                onerror="this.src='https://via.placeholder.com/300'">

            <div style="display:flex;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
                ${thumbsHtml}
            </div>

            <h2 style="margin:8px 0;color:#111;font-size:22px;">${product.name}</h2>
            <p style="font-size:20px;color:#c8a96e;font-weight:bold;margin:6px 0;">
                PKR ${Number(product.price).toLocaleString()}
            </p>
            <p style="color:#555;margin:10px 0;line-height:1.6;font-size:14px;">
                ${product.description || "No description available."}
            </p>

            <button onclick="addToCart(${product.id}); document.getElementById('details-modal').style.display='none';"
                style="margin-top:15px;padding:12px 30px;background:linear-gradient(90deg,#f1c40f,#e67e22);
                color:#222;border:none;border-radius:8px;cursor:pointer;
                font-size:16px;font-weight:bold;width:100%;
                box-shadow:0 4px 15px rgba(241,196,15,0.4);">
                🛒 Add To Cart
            </button>
        </div>
    `;

    modal.style.display = "flex";
    modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

// ================== CART COUNT ==================
// ================== CART COUNT ==================
function updateCartCount() {
    fetch("http://localhost/KHAADI/backend/api/get_cart.php", {
        credentials: "include"  // ✅ YEH ADD KARO — session milega tabhi
    })
    .then(res => res.json())
    .then(data => {
        const el = document.getElementById("cart-count");
        if (el && data.cart) {
            let total = data.cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
            el.innerText = total;
        }
    })
    .catch(() => {});
}
// ================== TOAST ==================
function showToast(msg) {
    let toast = document.getElementById("khaadi-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "khaadi-toast";
        toast.style.cssText = `
            position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
            background:#111;color:#f1c40f;padding:13px 28px;
            border-radius:30px;font-weight:bold;z-index:99999;
            font-size:15px;box-shadow:0 4px 20px rgba(0,0,0,0.4);
            transition:opacity 0.4s ease;pointer-events:none;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.opacity = "1";
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.style.opacity = "0", 2500);
}

// ================== DISPLAY PRODUCTS ==================
function displayProducts(list) {
    const container = document.getElementById("product-list");
    if (!container) return;
    container.innerHTML = "";

    if (!list || list.length === 0) {
        container.innerHTML = "<p style='text-align:center;padding:40px;color:#888;'>No products found.</p>";
        return;
    }

    list.forEach(p => {
        let allImages = [];
        if (p.image) allImages.push(getImageUrl(p.image));
        if (p.extra_images && p.extra_images.length > 0)
            p.extra_images.forEach(img => allImages.push(getImageUrl(img)));
        if (allImages.length === 0) allImages.push("https://via.placeholder.com/300");

        let slidesHtml = allImages.map((img, idx) => `
            <img src="${img}" class="slide-img"
                style="display:${idx===0?'block':'none'};width:100%;height:280px;
                object-fit:cover;border-radius:8px;"
                onerror="this.src='https://via.placeholder.com/300'">
        `).join("");

        let dotsHtml = allImages.length > 1 ? `
            <div style="text-align:center;margin-top:6px;">
                ${allImages.map((_,idx) => `
                    <span onclick="changeSlide(${p.id},${idx})"
                        style="display:inline-block;width:8px;height:8px;border-radius:50%;
                        background:${idx===0?'#333':'#ccc'};margin:0 3px;cursor:pointer;"
                        data-dot="${p.id}-${idx}"></span>
                `).join("")}
            </div>` : "";

        let arrowsHtml = allImages.length > 1 ? `
            <button onclick="prevSlide(${p.id})"
                style="position:absolute;top:50%;left:5px;transform:translateY(-50%);
                background:rgba(0,0,0,0.4);color:#fff;border:none;
                border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px;">‹</button>
            <button onclick="nextSlide(${p.id})"
                style="position:absolute;top:50%;right:5px;transform:translateY(-50%);
                background:rgba(0,0,0,0.4);color:#fff;border:none;
                border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px;">›</button>` : "";

        const card = document.createElement("div");
        card.className = "product-card";
        card.style.position = "relative";
        card.setAttribute("data-id", p.id);
        card.setAttribute("data-slide", "0");
        card.setAttribute("data-total", allImages.length);

        card.innerHTML = `
            <div class="wishlist" data-id="${p.id}" style="position:absolute;top:10px;right:10px;
                cursor:pointer;font-size:22px;z-index:10;">❤️</div>
            <div class="slider" style="position:relative;">
                ${slidesHtml}${arrowsHtml}
            </div>
            ${dotsHtml}
            <div class="product-info" style="padding:12px;">
                <h3 style="margin:8px 0;font-size:16px;">${p.name}</h3>
                <div class="price" style="color:#c8a96e;font-weight:bold;font-size:15px;">
                    PKR ${Number(p.price).toLocaleString()}
                </div>
                <div class="desc" style="color:#777;font-size:13px;margin:6px 0;">
                    ${p.description || ""}
                </div>
                <div style="display:flex;gap:8px;margin-top:10px;">
                    <button class="add-btn" onclick="addToCart(${p.id})"
                        style="flex:1;padding:9px;background:linear-gradient(90deg,#f1c40f,#e67e22);
                        color:#222;border:none;border-radius:7px;cursor:pointer;
                        font-weight:bold;font-size:13px;">
                        🛒 Add To Cart
                    </button>
                    <button class="details-btn" onclick="showProductDetails(${p.id})"
                        style="flex:1;padding:9px;background:#111;
                        color:#f1c40f;border:none;border-radius:7px;cursor:pointer;
                        font-weight:bold;font-size:13px;">
                        👁 View Details
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    initWishlistHandler();
}

// ================== SLIDESHOW ==================
function changeSlide(productId, index) {
    const card = document.querySelector(`[data-id="${productId}"]`);
    if (!card) return;
    card.querySelectorAll(".slide-img").forEach((s,i) => s.style.display = i===index?"block":"none");
    card.querySelectorAll("[data-dot]").forEach((d,i) => d.style.background = i===index?"#333":"#ccc");
    card.setAttribute("data-slide", index);
}
window.nextSlide = function(p) {
    const c = document.querySelector(`[data-id="${p}"]`);
    if (!c) return;
    const t = parseInt(c.getAttribute("data-total"));
    changeSlide(p, (parseInt(c.getAttribute("data-slide"))+1) % t);
};
window.prevSlide = function(p) {
    const c = document.querySelector(`[data-id="${p}"]`);
    if (!c) return;
    const t = parseInt(c.getAttribute("data-total"));
    changeSlide(p, (parseInt(c.getAttribute("data-slide"))-1+t) % t);
};

// ================== LOAD PRODUCTS ==================
function loadProducts() {
    fetch("http://localhost/KHAADI/backend/api/get_products.php")
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            products = data || [];
            console.log("Products loaded:", products.length);
            displayProducts(products);
        })
        .catch(err => {
            console.error("Load error:", err);
            const c = document.getElementById("product-list");
            if (c) c.innerHTML = "<p style='color:red;text-align:center;padding:40px;'>Server se data nahi aaya.</p>";
        });
}

// ================== SEARCH ==================
function initSearch() {
    const btn   = document.getElementById("search-btn");
    const input = document.getElementById("search");
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
        const term = input.value.toLowerCase().trim();
        displayProducts(term ? products.filter(p => p.name.toLowerCase().includes(term)) : products);
    });
    input.addEventListener("keypress", e => { if (e.key==="Enter") btn.click(); });
}

// ================== WISHLIST ==================
function initWishlistHandler() {
    document.querySelectorAll(".wishlist").forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if (favorites.includes(id)) btn.style.color = "red";
        btn.addEventListener("click", () => {
            if (favorites.includes(id)) {
                favorites = favorites.filter(f => f !== id);
                btn.style.color = "";
            } else {
                favorites.push(id);
                btn.style.color = "red";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    });
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    loadProducts();
    updateCartCount();
    initSearch();
});

// ================== ADMIN BUTTON ==================
document.addEventListener("DOMContentLoaded", () => {
    const adminBtn = document.getElementById("admin-login-btn");
    if (adminBtn) adminBtn.addEventListener("click", () => window.location.href = "admin/admin.html");
});