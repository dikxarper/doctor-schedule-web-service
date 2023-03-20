import { Router } from "express"
import { getIndex, postIndex } from "../controllers/index.js"
const router = Router()

router.get("/", getIndex)

export { router as indexRoute }
