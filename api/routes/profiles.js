import { Router } from "express"
const router = Router()

router.get("/", (req, res) => {
  res.render("profile")
})

export { router as profileRoute }
