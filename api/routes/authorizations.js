import { Router } from "express"
import * as AuthController from "../controllers/authorization.js"
import { authMiddleware } from "../middleware/authorization.js"

const router = Router()

// Login router
router
  .route("/")
  .get(AuthController.getLogin)
  .post(AuthController.postLogin, authMiddleware)

// Logout router
router.get("/logout", AuthController.logout)

export { router as authRoute }
