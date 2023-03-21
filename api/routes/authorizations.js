import { Router } from "express"
import * as AuthController from "../controllers/authorization.js"

const router = Router()

router.route("/").get(AuthController.getLogin)
router.route("/").post(AuthController.postLogin)

router.route("/register").get(AuthController.getRegister)
router.route("/register").post(AuthController.postRegister)

router.route("/register/checked").get(AuthController.getCheckRegister)
router.route("/register/checked").post(AuthController.postCheckRegister)

export { router as authRoute }
