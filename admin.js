// ================= ADMIN STATUS =================
function saveAdminStatus(status) {
    localStorage.setItem("adminLoggedIn", status);
}
function getAdminStatus() {
    return localStorage.getItem("adminLoggedIn") === "true";
}

let products = [];

// ================= ELEMENTS =================
const adminLoginSection = document.getElementById("admin-login");
const adminPanelSection = document.getElementById("admin-panel");
const loginBtn = document.getElementById("admin-login-btn");
const logoutBtn = document.getElementById("logout-btn");
const addProductBtn = document.getElementById("add-product-btn");

// ================= SHOW/HIDE =================
function showPanel() {
    if (adminLoginSection) adminLoginSection.style.display = "none";
    if (adminPanelSection) adminPanelSection.style.display = "block";
    loadProducts();
    setTimeout(() => {
        showAllOrders();
    }, 300);
}

function showLogin() {
    if (adminLoginSection) adminLoginSection.style.display = "block";
    if (adminPanelSection) adminPanelSection.style.display = "none";
}

// ================= LOGIN =================
function adminLogin() {
    const email = document.getElementById("admin-email").value.trim();
    const pass = document.getElementById("admin-password").value.trim();
    const msg = document.getElementById("admin-msg");

    if (!email || !pass) {
        msg.style.color = "red";
        msg.textContent = "Fill all fields";
        return;
    }

    if (email === "jasimkhan5917@gmail.com" && pass === "@Jasim1234") {
        msg.style.color = "green";
        msg.textContent = "Login Success";
        saveAdminStatus("true");
        showPanel();
    } else {
        msg.style.color = "red";
        msg.textContent = "Wrong Login";
    }
}

// ================= ADD PRODUCT =================
// ================= ADD PRODUCT =================
function addProduct() {
    const name = document.getElementById("product-name").value.trim();
    const price = document.getElementById("product-price").value.trim();
    const desc = document.getElementById("product-description").value.trim();
    const imageInput = document.getElementById("admin-prod-img-file");

    if (!name || !price || !desc || imageInput.files.length === 0) {
        alert("Fill all fields and select at least one image.");
        return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", desc);

    // ✅ Saari images append karo
    for (let i = 0; i < imageInput.files.length; i++) {
        formData.append("images[]", imageInput.files[i]);
    }

    fetch("http://localhost/KHAADI/backend/api/add_product.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log("SERVER RESPONSE:", data);
        if (data.status === "success") {
            alert("Product add ho gaya!");
            loadProducts();
            document.getElementById("product-name").value = "";
            document.getElementById("product-price").value = "";
            document.getElementById("product-description").value = "";
            imageInput.value = "";
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => console.error("FETCH ERROR:", err));
}

// ================= LOAD PRODUCTS =================
function loadProducts() {
    fetch("http://localhost/KHAADI/backend/api/get_products.php")
    .then(res => {
        if (!res.ok) throw new Error("HTTP Error: " + res.status);
        return res.json();
    })
    .then(data => {
        products = data || [];
        displayProducts();
    })
    .catch(err => console.error("Load Products Error:", err));
}

// ================= DISPLAY PRODUCTS =================
function displayProducts() {
    const tbody = document.querySelector("#admin-product-list tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No products found</td></tr>`;
        return;
    }

    products.forEach(p => {
        let imageSrc = p.image && p.image.startsWith("http")
            ? p.image
            : p.image
                ? "http://localhost/KHAADI/backend/uploads/" + p.image
                : "https://via.placeholder.com/100";

        tbody.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>PKR ${p.price}</td>
                <td>${p.description}</td>
                <td>
                    <img src="${imageSrc}" width="80" style="border-radius:6px;"
                        onerror="this.src='https://via.placeholder.com/100'">
                </td>
                <td>
                    <button onclick="deleteProduct(${p.id})" style="
                        background:#e74c3c;color:#fff;border:none;
                        padding:6px 12px;border-radius:6px;cursor:pointer;">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// ================= DELETE PRODUCT =================
window.deleteProduct = function(id) {
    if (!confirm("delete product?")) return;

    fetch("http://localhost/KHAADI/backend/api/delete_product.php", {
        method: "POST",
        body: new URLSearchParams({ id: id })
    })
    .then(res => res.text())
    .then(() => {
        alert("Product delete !");
        loadProducts();
    })
    .catch(err => console.error("Delete error:", err));
};

// ================= SHOW ALL ORDERS =================
function showAllOrders() {
    const table = document.getElementById("ordersTable");
    const tbody = document.querySelector("#ordersTable tbody");

    if (!table) { console.error("ordersTable no show!"); return; }
    if (!tbody) { console.error("ordersTable tbody nahi mila!"); return; }

    table.style.display = "table";

    fetch("http://localhost/KHAADI/backend/api/get_order.php")
    .then(res => {
        if (!res.ok) throw new Error("HTTP Error: " + res.status);
        return res.json();
    })
    .then(orders => {
        tbody.innerHTML = "";

        if (!orders || orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:20px;">Koi order nahi</td></tr>`;
            return;
        }
orders.forEach(order => {
    // ✅ items JSON parse karo
    let itemsHtml = "";
    try {
        const items = JSON.parse(order.items || "[]");
        if (items.length > 0) {
            itemsHtml = items.map(item => `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="http://localhost/KHAADI/backend/uploads/${item.image}"
                        width="55" height="55"
                        style="border-radius:6px;object-fit:cover;"
                        onerror="this.src='https://via.placeholder.com/55'">
                    <div>
                        <div style="font-weight:bold;font-size:13px;">${item.name || 'N/A'}</div>
                        <div style="font-size:12px;color:#888;">Qty: ${item.quantity} | PKR ${item.price}</div>
                    </div>
                </div>
            `).join("");
        } else {
            itemsHtml = "<span style='color:#aaa;'>N/A</span>";
        }
    } catch(e) {
        itemsHtml = "<span style='color:#aaa;'>N/A</span>";
    }

   tbody.innerHTML += `
    <tr>
        <td style="min-width:200px;">${itemsHtml}</td>
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.address}</td>
        <td>${order.email}</td>
        <td>${order.quantity ?? '-'}</td>
        <td>PKR ${order.total}</td>
        <td>
            <span style="background:#8e44ad;color:#fff;padding:4px 10px;
                border-radius:12px;font-size:13px;font-weight:bold;">
                ${order.tracking_id ?? 'N/A'}
            </span>
        </td>
        <td>
            <span style="padding:4px 10px;border-radius:12px;
                background:${
                    order.status === 'Delivered'  ? '#27ae60' :
                    order.status === 'Processing' ? '#2980b9' : '#f39c12'
                };color:#fff;font-size:13px;">
                ${order.status}
            </span>
        </td>
        <td>
            <select onchange="updateStatus(${order.id}, this.value)"
                style="padding:5px;border-radius:5px;cursor:pointer;">
                <option value="pending"    ${order.status==='pending'    ? 'selected':''}>Pending</option>
                <option value="Processing" ${order.status==='Processing' ? 'selected':''}>Processing</option>
                <option value="Delivered"  ${order.status==='Delivered'  ? 'selected':''}>Delivered</option>
            </select>
        </td>
        <td>
            <button onclick="deleteOrder(${order.id})" style="
                background:#e74c3c;color:#fff;border:none;
                padding:6px 12px;border-radius:6px;cursor:pointer;">
                Delete
            </button>
        </td>
    </tr>
`;
        });
        }).catch(err => {
        console.error("Orders load error:", err);
        tbody.innerHTML = `<tr><td colspan="11" style="color:red;text-align:center;">Orders load nahi hue: ${err.message}</td></tr>`;
    });
}

// ================= UPDATE STATUS =================
window.updateStatus = function(id, status) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    fetch("http://localhost/KHAADI/backend/api/update_order_status.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log("Status update:", data);
        showAllOrders();
    })
    .catch(err => console.error("Update error:", err));
};

// ================= DELETE ORDER =================
window.deleteOrder = function(id) {
    if (!confirm("Confirmed in Order delete ?")) return;

    let formData = new FormData();
    formData.append("id", id);

    fetch("http://localhost/KHAADI/backend/api/delete_order.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log("Order delete response:", data);
        alert("Order delete ho gaya!");
        showAllOrders();
    })
    .catch(err => console.error("Delete order error:", err));
};

// ================= EVENTS =================
if (loginBtn) {
    loginBtn.addEventListener("click", function(e) {
        e.preventDefault();
        adminLogin();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        saveAdminStatus("false");
        showLogin();
    });
}

if (addProductBtn) {
    addProductBtn.addEventListener("click", function(e) {
        e.preventDefault();
        addProduct();
    });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function() {
    if (getAdminStatus()) {
        showPanel();
    } else {
        showLogin();
    }
});