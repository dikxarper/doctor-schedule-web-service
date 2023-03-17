import { Router } from "express"
import * as AuthController from "../controllers/authorization.js"

const router = Router()

router.get("/", AuthController.getLogin)

router.post("/login", (req, res) => {})

router.get("/register", AuthController.getRegister)

router.post("/register", (req, res) => {})

router.get("/register-checked", AuthController.getCheckRegister)

export { router as authRoute }
