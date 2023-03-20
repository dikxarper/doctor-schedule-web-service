// GET Login page
export async function getLogin(req, res) {
  return res.render("auth/login")
}

// POST Login page
export async function postLogin(req, res) {
  try {
    const { UIN, password } = req.body
    
  } catch (e) {
    if (e) console.log(e)
  }
}

// GET Register page
export async function getRegister(req, res) {
  return res.render("auth/registration")
}

// GET Checked Register page
export async function getCheckRegister(req, res) {
  return res.render("auth/registration-checked")
}
