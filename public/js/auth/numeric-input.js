const input = document.getElementById("floatingNumber")
const regex = new RegExp("^[0-9+]*$")

input.addEventListener("beforeinput", (event) => {
  if (event.data != null && !regex.test(event.data)) event.preventDefault()
})
