// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import bcrypt from "bcrypt"
import express from "express"
import jwt from "jsonwebtoken"
import { connection } from "../../config/db.js"

const app = express()

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
    const { uin, password } = req.body
    if (!errors.isEmpty())
      return res.json({ message: "Ошибка при логине", errors })

    if (!uin || !password)
      return res.json({
        status: "error",
        error: "ИИН и пароль должны быть заполнены!",
      })
    else {
      connection.query(
        "SELECT * FROM doctors WHERE uin = ?",
        [uin],
        async (error, result) => {
          console.log(result)
          if (error) throw error
          if (
            !result.length ||
            !(await bcrypt.compare(password, result[0].password))
          ) {
            return res.json({
              status: "error",
              error: "Неправильный ИИН или пароль!",
            })
          } else {
            const token = jwt.sign(
              { id: result[0].doctor_id, role: result[0].role },
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.JWT_EXPIRES,
              }
            )

            res.cookie("token", token)
            req.app.locals.isLogged = "isLoggedIn"

            if (result[0].role === "admin") {
              res.app.locals.role = "admin"
              res.redirect("/admin")
            } else {
              return res
                .status(StatusCodes.OK)
                .redirect(`/profile/${result[0].doctor_id}`)
            }
          }
        }
      )
    }
  } catch (error) {
    console.log(error)
  }
}

// LOGOUT route
export async function logout(req, res) {
  req.app.locals.isLogged = "isLoggedOut"
  req.app.locals.user = null
  req.app.locals.role = null
  res.clearCookie("token")

  req.session.destroy((error) => {
    if (error) {
      console.log(error)
      res.send("Error loggin out")
    } else {
      res.redirect("/auth")
    }
  })
}
