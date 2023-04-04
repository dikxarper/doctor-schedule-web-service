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
    } else {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET)
      const user = req.app.locals.user
      if (user) {
        if (user.id === decodedData.id) {
          next()
        } else {
          return res.send("Пользователь не авторизован!")
        }
      } else {
        res.app.locals.user = decodedData
        next()
      }
    }
  } catch (error) {
    console.log(error)
    return res.send("Пользователь не авторизован")
  }
}
