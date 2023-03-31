const togglePassword = document.querySelector("#togglePassword")
const password = document.querySelector("#floatingPassword")

togglePassword.addEventListener("click", function () {
  // Toggle the type attribute using
  // getAttribure() method
  const type =
    password.getAttribute("type") === "password" ? "text" : "password"

  password.setAttribute("type", type)

  // Toggle the eye and bi-eye icon
  this.classList.toggle("bi-eye")
})
