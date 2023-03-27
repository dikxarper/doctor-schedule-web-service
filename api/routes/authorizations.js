import { Router } from "express"
import * as AuthController from "../controllers/authorization.js"

const router = Router()

// Login router
router.route("/").get(AuthController.getLogin).post(AuthController.postLogin)

// Register router
router
  .route("/register")
  .get(AuthController.getRegister)
  .post(AuthController.postRegister)

export { router as authRoute }
