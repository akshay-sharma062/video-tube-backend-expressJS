import { Router } from "express";
import { loginUser, registerUser,logoutUser } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from '../middleware/auth.middleware.js'; 

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
router.route('/login').post(loginUser)

// secure route

router.route('/logout').post(verifyJWT,logoutUser)


export default router