import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError }   from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {apiResponse} from '../utils/apiResponse.js'

const registerUser = asyncHandler( async (req,res) => {
   
    const {fullname,email,username,password}=req.body //data form postman or frontend
    // console.log("fullname",fullname)

    //validation for no empty
    /*if (fullname === "") {
         throw new apiError(401,'enter fullName',errors)  
         } 
         */ 
         if (
        [fullname,email,username,password].some((field)=>
            field?.trim() ==="")
    ) {
        throw new apiError(400,'All fields are required') 
    }

    // check user already exists
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if (existedUser) {
        throw new apiError(409,"user already exists ")
    }

    //check avatar is uploaded
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    if (!avatarLocalPath) {
      throw new apiError(409, "avatar is required");
    }

    //upload images to cloudinary


   const avatar = await uploadOnCloudinary(avatarLocalPath)
//    console.log("Cloudinary avatar response:", avatar);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if (!avatar) {
    throw new apiError(409,"avatar is required")
    }

    // create entry in database

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        username:username.toLowerCase(),
        password
    })

    // check user is created succsessfully and remove password and refresh token


    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken" 
    )
    if (!userCreated) {
        throw new apiError(501,'user not created')
    }

    //return the responese

    return res.status(201).json( 
        new apiResponse(201,userCreated,'user created successfully')
    )
})


export {registerUser}