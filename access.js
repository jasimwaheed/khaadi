function signup(){
    let name     = document.getElementById("user").value.trim();
    let email    = document.getElementById("email").value.trim();  // ✅ ab direct milega
    let password = document.getElementById("pass").value;

    // ✅ basic validation
    if(!name || !email || !password){
        alert("Sab fields bharain ❌");
        return;
    }

    fetch("http://localhost/KHAADI/backend/api/user_signup.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "name="     + encodeURIComponent(name) +
              "&email="    + encodeURIComponent(email) +
              "&password=" + encodeURIComponent(password)
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            alert("Signup Successful ✅");
            redirectAfterLogin();
        } else {
            alert(data.msg || "Signup failed");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}