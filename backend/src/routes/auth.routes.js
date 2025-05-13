import express from "express"
import { logout, onboard, signin, signup } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

router.get("/me", protectRoute, (req,res)=>{
    return res.status(200).json({success:true, user: req.user})
})
export default router