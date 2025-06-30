import { Router } from "express";
import { registerUser } from "../controllers/user.controlers.js";
import { upload } from "../midleware/multer.middleware.js";
const router = Router()


router.route("/register").post( 
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },
        {
            name : 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)




export default router