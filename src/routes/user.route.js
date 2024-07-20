import { Router } from "express";
import { getalluser, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()



router.route("/register").post(
    upload.fields([

        {
            name: "cnicImg",
            maxCount: 1
        },
        {
            name: "profileImg",
            maxCount: 1

        }
    ])
    , registerUser)

router.route("/login").post(loginUser)
router.route("/").get(getalluser)

export default router