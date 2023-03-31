// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import jwt from "jsonwebtoken"

export async function authMiddleware(req, res, next) {
  if (req.method === "OPTIONS") next()

  try {
    const token = req.cookies.token

    if (!token) {
      return res.send("Пользователь не авторизован!")
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    res.app.locals.user = decodedData

    next()
  } catch (error) {
    console.log(error)
    return res.send("Пользователь не авторизован")
  }
}
