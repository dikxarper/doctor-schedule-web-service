import { Router } from "express"
import * as AuthController from "../controllers/authorization.js"
import { check } from "express-validator"
import { authMiddleware } from "../middleware/authorization.js"

const router = Router()

//[
//check("uin", "ИИН должен состоять из цифров").isNumeric(),]

// Login router
router
  .route("/")
  .get(AuthController.getLogin)
  .post(AuthController.postLogin, authMiddleware, [
    check("uin", "ИИН состоит 12 цифров").isLength(12),
  ])

// Register router
router
  .route("/register")
  .get(AuthController.getRegister)
  .post(AuthController.postRegister)

// Password Recovery page
router.route("/passwordRecovery").get(AuthController.getPasswordRecovery)

// Logout router
router.get("/logout", AuthController.logout)

export { router as authRoute }
