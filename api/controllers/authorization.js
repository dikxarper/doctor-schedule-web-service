import { query } from "express"
import "express-async-errors"

// GET Login page
export async function getLogin(req, res) {
  try {
    return res.render("auth/login")
  } catch (error) {
    console.log(error)
    return res.status(404).send("Not found")
  }
}

// POST Login page
export async function postLogin(req, res) {
  try {
    const { UIN, password } = req.body

    if (UIN && password) {
      query = `SELECT uin, password FROM users 
      WHERE uin = "${UIN}"
      `
     }
  } catch (error) {
    if (error) console.log(error)
  }
}

// GET Register page
export async function getRegister(req, res) {
  return res.render("auth/registration")
}

// POST Register page
export async function postRegister(req, res) {
  
  return res.send("auth/registration")
}

// GET Checked Register page
export async function getCheckRegister(req, res) {
  return res.render("auth/registration-checked")
}

// POST Checked Register page
export async function postCheckRegister(req, res) {
  return res.send("auth/registration-checked")
}
