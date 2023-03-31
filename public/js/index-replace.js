// select all td elements containing the word "Выходной"
const exitCells = document.querySelectorAll('td:contains("Выходной")')

// loop over each selected element and modify its text content
exitCells.forEach((cell) => {
  const text = cell.textContent
  const newText = text.replace(/Выходной\s+  -/g, "Выходной")
  cell.textContent = newText
})
