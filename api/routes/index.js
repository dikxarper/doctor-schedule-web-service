import { Router } from "express"
import * as indexController from "../controllers/index.js"
const router = Router()

// index route
router.get("/", indexController.getIndex)

//about route
router.get("/table", indexController.getTable)

export { router as indexRoute }
