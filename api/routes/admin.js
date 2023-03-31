import express from "express"
import * as adminController from "../controllers/admin.js"
import { authMiddleware } from "../middleware/authorization.js"
const router = express.Router()

router.get("/", authMiddleware, adminController.getAdmin)

router
  .route("/new", authMiddleware)
  .get(adminController.getAdminNew)
  .post(adminController.postAdminNew)

router
  .route("/:id/edit", authMiddleware)
  .get(adminController.getAdminEdit)
  .post(adminController.postAdminEdit)

router.post("/:id/delete", authMiddleware, adminController.postAdminDelete)

export { router as adminRoute }
