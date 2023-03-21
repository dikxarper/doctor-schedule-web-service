const dropdownLinks = document.querySelectorAll(".dropdown-content a")
const contents = document.querySelectorAll(".content")

dropdownLinks.forEach((link) => {
  link.addEventListener("click", (error) => {
    error.preventDefault()
    const contentToShow = link.dataset.show
    contents.forEach((content) => {
      content.classList.remove("active")
      if (content.id === contentToShow) {
        content.classList.add("active")
      }
    })
  })
})
