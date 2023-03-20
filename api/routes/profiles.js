import { Router } from "express"
import { getProfile, postProfile } from "../controllers/profile.js"
const router = Router()

router.get("/", getProfile)

export { router as profileRoute }
