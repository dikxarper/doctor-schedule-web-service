import { Router } from "express"
import * as profileController from "../controllers/profile.js"

import { authMiddleware } from "../middleware/authorization.js"
const router = Router()

router.get("/:id", profileController.getProfile)
router.post("/:id/edit", profileController.patchProfile)

router.post("/:id/editSchedule", authMiddleware, profileController.postSchedule)

export { router as profileRoute }
