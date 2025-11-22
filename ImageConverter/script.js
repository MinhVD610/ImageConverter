const userNameElement = document.getElementById("userName");
const loginBtnElement = document.getElementById("loginBtn");
const passWordElement = document.getElementById("passWord");
const redirectElement = document.getElementById("redirect");
const successedElement = document.getElementById("successed");
const failedElement = document.getElementById("failed");

loginBtnElement.style.cursor = "pointer";
loginBtnElement.style.padding = "5px 15px";
loginBtnElement.style.fontSize = "16px";
loginBtnElement.style.backgroundColor = "aqua";
loginBtnElement.style.border = "none";
loginBtnElement.style.borderRadius = "4px";

function toast(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.position = "fixed";
  div.style.top = "150px";
  div.style.left = "150px";
  div.style.background = "rgba(0,0,0,0.8)";
  div.style.color = "#fff";
  div.style.padding = "10px 15px";
  div.style.borderRadius = "6px";
  div.style.fontSize = "14px";
  div.style.zIndex = "9999";
  div.style.opacity = "1";
  div.style.transition = "opacity 0.5s";
  div.style.transform = "translateY(20px)";
  div.style.transition = "opacity .5s, transform .5s";

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  }, 1000);
}

loginBtnElement.addEventListener("click", function () {
  const userName = userNameElement.value;
  const password = passWordElement.value;
  if (userName === "admin" && password === "123456") {
    toast("Login Successful! Welcome, Admin.");
    // Swal.fire({
    //   title: "Đã lưu!",
    //   timer: 1000,
    //   showConfirmButton: false,
    //   toast: true,
    //   position: "top-end",
    // });
    userNameElement.style.borderColor = "green";
    passWordElement.style.borderColor = "green";
    successedElement.style.color = "green";
    successedElement.hidden = false;
    failedElement.hidden = true;
    setTimeout(() => {
      window.location.href = "convert.html";
    }, 100);
  } else {
    // alert("Invalid username or password.");
    toast("Login Failed! Please check your username and password.");
    userNameElement.style.borderColor = "red";
    passWordElement.style.borderColor = "red";
    failedElement.style.color = "red";
    failedElement.hidden = false;
    redirectElement.removeEventListener = "click";
  }
});
