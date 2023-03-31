// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import bcrypt from "bcrypt"
import { v4 } from "uuid"
import express from "express"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import { connection } from "../../config/db.js"
import { validationResult } from "express-validator"

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
    const errors = validationResult(req)

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

// GET Register page
export async function getRegister(req, res) {
  return res.render("auth/registration")
}

// POST Register page
export async function postRegister(req, res) {
  // check existing user
  const {
    uin,
    password,
    firstname,
    middlename,
    lastname,
    email,
    phone,
    department,
    position,
    cabinet,
    floor,
  } = req.body
  if (!uin || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "ИИН и пароль должны быть заполнены!" })
  else {
    connection.query(
      "SELECT * FROM doctors WHERE uin = ?",
      [uin],
      async (error, result) => {
        if (error) throw error
        if (result[0]) {
          console.log(result[0])
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Пользователь с таким ИИН-ом уже зарегестрирован!" })
        } else {
          const hashPassword = await bcrypt.hash(password, 10)
          connection.query(
            "INSERT INTO doctors SET ?",
            {
              id: v4(),
              uin: uin,
              password: hashPassword,
              firstname: firstname,
              middlename: middlename,
              lastname: lastname,
              email: email,
              phone: phone,
              department: department,
              position: position,
              cabinet: cabinet,
              floor: floor,
            },
            (error, result) => {
              if (error) throw error

              return res.status(StatusCodes.CREATED).json({
                message: "Пользователь успешно зарегестрировался!",
                result,
              })
            }
          )
        }
      }
    )
  }
}

export async function getPasswordRecovery(req, res) {
  res.render("auth/password-recovery")
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
