export async function getLogin(req, res) {
  return res.render("auth/login")
}

export async function getRegister(req, res) {
  return res.render("auth/registration")
}

export async function getCheckRegister(req, res) {
  return res.render("auth/registration-checked")
}
