// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import "express-async-errors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import { connection } from "../../config/db.js"

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
  const { email, password } = req.body
  if (!email || !password)
    return res.json({
      status: "error",
      error: "Please enter your email and password",
    })
  else {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, result) => {
        console.log(result)
        if (error) throw error
        if (
          !result.length ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          return res.json({
            status: "error",
            error: "Incorrect email or password",
          })
        } else {
          const token = jwt.sign(
            { id: result[0].id, name: result[0].name },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES,
            }
          )
          return res.status(StatusCodes.OK).json({
            status: "successs",
            success: "User has already logged in",
            token,
          })
        }
      }
    )
  }
}

// GET Register page
export async function getRegister(req, res) {
  return res.render("auth/registration")
}

// POST Register page
export async function postRegister(req, res) {
  // check existing user
  const { email, password, name } = req.body
  if (!email || !password || !name)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide name, email and password" })
  else {
    connection.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (error, result) => {
        if (error) throw error
        if (result[0])
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Email has already been registered" })
        else {
          const hashPassword = await bcrypt.hash(password, 10)
          connection.query(
            "INSERT INTO users SET ?",
            {
              name: name,
              email: email,
              password: hashPassword,
            },
            (error, result) => {
              if (error) throw error

              return res
                .status(StatusCodes.CREATED)
                .json({ msg: "New User Created" })
            }
          )
        }
      }
    )
  }
}

// LOGOUT route
export async function logout(req, res) {}
