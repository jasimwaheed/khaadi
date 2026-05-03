document.addEventListener("DOMContentLoaded", function () {

    const trackBtn    = document.getElementById("track-btn");
    const orderInput  = document.getElementById("order-id-input");
    const trackResult = document.getElementById("track-result");

    if (!trackBtn) return;

    trackBtn.addEventListener("click", () => {

        const tracking_id = orderInput.value.trim().toUpperCase();

        if (!tracking_id) {
            alert("Please enter Tracking ID (e.g. ORD-001)");
            return;
        }

        trackResult.innerHTML = `<p style="color:#888;">Searching...</p>`;

        let formData = new FormData();
        formData.append("tracking_id", tracking_id);

        fetch("http://localhost/KHAADI/backend/api/track_order.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log("Track response:", data);

            if (data.status === "not_found") {
                trackResult.innerHTML = `
                    <p style="color:red;font-weight:bold;">
                        No order found with ID: ${tracking_id}
                    </p>`;
                return;
            }

            if (data.status === "success") {
                const o = data.order;

                let statusColor =
                    o.status === "Delivered"  ? "#27ae60" :
                    o.status === "Processing" ? "#2980b9" : "#f39c12";

                trackResult.innerHTML = `
                    <div style="
                        border:1px solid #ddd;
                        border-radius:12px;
                        padding:20px;
                        background:#fff;
                        max-width:500px;
                        margin:20px auto;">

                        <h3 style="margin-bottom:15px;color:#333;">Order Details</h3>

                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="padding:8px;color:#888;width:40%;">Tracking ID</td>
                                <td style="padding:8px;font-weight:bold;color:#8e44ad;">
                                    ${o.tracking_id ?? '-'}
                                </td>
                            </tr>
                            <tr style="background:#f9f9f9;">
                                <td style="padding:8px;color:#888;">Name</td>
                                <td style="padding:8px;">${o.name ?? '-'}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;color:#888;">Phone</td>
                                <td style="padding:8px;">${o.phone ?? '-'}</td>
                            </tr>
                            <tr style="background:#f9f9f9;">
                                <td style="padding:8px;color:#888;">Address</td>
                                <td style="padding:8px;">${o.address ?? '-'}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;color:#888;">Email</td>
                                <td style="padding:8px;">${o.email ?? '-'}</td>
                            </tr>
                            <tr style="background:#f9f9f9;">
                                <td style="padding:8px;color:#888;">Total</td>
                                <td style="padding:8px;font-weight:bold;">PKR ${o.total ?? '0'}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;color:#888;">Quantity</td>
                                <td style="padding:8px;">${o.quantity ?? '-'}</td>
                            </tr>
                            <tr style="background:#f9f9f9;">
                                <td style="padding:8px;color:#888;">Status</td>
                                <td style="padding:8px;">
                                    <span style="
                                        background:${statusColor};
                                        color:#fff;
                                        padding:4px 12px;
                                        border-radius:12px;
                                        font-size:13px;">
                                        ${o.status ?? 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
            } else {
                trackResult.innerHTML = `<p style="color:red;">Error: ${data.message}</p>`;
            }
        })
        .catch(err => {
            console.error("Track error:", err);
            trackResult.innerHTML = `<p style="color:red;">Please try again later. First connect to the internet or server. </p>`;
        });
    });
});