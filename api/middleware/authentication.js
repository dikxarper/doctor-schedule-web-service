// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import { connection } from "../../config/db.js"
import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    console.log(req.headers["authorization"])

    return res.json({ msg: "error", error: "Authentication Invalid" })
  }

  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) res.json("no token")

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.json("verify error")

      req.user = user
      next()
    })
  } catch (error) {
    return res.json({ msg: "error", error: "Authentication Invalid here" })
  }
}

export { auth as authMiddleware }
