import { Router } from "express"
import * as profileController from "../controllers/profile.js"

import { authMiddleware } from "../middleware/authorization.js"
const router = Router()

router.get("/:id", authMiddleware, profileController.getProfile)
router.post("/:id/edit", authMiddleware, profileController.patchProfile)

router.post("/:id/editSchedule", profileController.postSchedule)

export { router as profileRoute }
