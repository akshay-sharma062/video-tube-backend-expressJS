import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const genrateAccessAndRefreshTokens = async (userId) => {
    try {
       const user = await User.findById(userId)
       const accessToken =  user.genrateAccessToken()
       const refreshToken = user.genrateRefreshToken()
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})

        return {
            refreshToken,
            accessToken
        }

    } catch (error) {
        throw new apiError(500,'somthing went wrong while genrating access orr refresh tokens')
    }
    
}


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body; //data form postman or frontend
  // console.log("fullname",fullname)
  // console.log('request { UserControlers }',req)
  // console.log('request.Body { UserControlers }',req.body)
  //validation for no empty
  /*if (fullname === "") {
                        throw new apiError(401,'enter fullName',errors)  
                        } 
                        */
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // check user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "user already exists ");
  }

  //check avatar is uploaded
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(409, "avatar is required");
  }

  //upload images to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //    console.log("Cloudinary avatar response:", avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new apiError(409, "avatar is Not uploded succsessfully ");
  }

  // create entry in database

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  // check user is created succsessfully and remove password and refresh token

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!userCreated) {
    throw new apiError(501, "user not created");
  }

  //return the responese
  console.log("user Created success");
  return res
    .status(201)
    .json(new apiResponse(201, userCreated, "user created successfully"));
});
    //Login User
  const loginUser = asyncHandler(async (req,res) => {
        //get data from req.body
        const {email,userName,password} = req.body
        if (!(userName || email)) {
            throw new apiError(400,'username or Email required')
        }
        //find user's userName or email exists
        const user = await User.findOne({
                $or:[{userName},{email}]
            })
        if (!user) {
            throw new apiError(401,'user not exists')
        }
        // password check

           const isPasswordValid = await user.isPasswordCorrect(password)
            if (!isPasswordValid) {
                throw new apiError(401,'invalid user credintials')
            }

        // genrate access & refreshToken 

            const {accessToken,refreshToken} = await genrateAccessAndRefreshTokens(user._id)

            const loggedInUser = await User.findById(user._id).select("-password -refreshToken")//optional code
        //send in cookies access & refreshToken 
 

            const options = {
                httpOnly : true,
                secure : true
              }
              console.log("Access Token (type):", typeof(accessToken), accessToken);
              console.log("Refresh Token (type):", typeof(refreshToken), refreshToken);
            return res.status(200)
                    .cookie("accessToken",accessToken,options)
                    .cookie('refreshToken',refreshToken,options)
                    .json(new apiResponse(200,{
                        user : loggedInUser,
                               refreshToken,
                               accessToken
                        },"user loggedIn successfully"))

    })
    
    // Logout User
    const logoutUser = asyncHandler(async (req,res) => {
      //remove refresh token from db
      await User.findByIdAndUpdate( 
        req.user._id,
        {
          $set:{
            refreshToken : undefined
          }
        },
          {
            new:true
          }
      )
      // clear cookies
      const options ={
        httpOnly:true,
        secure: true
      }

      return res
              .status(200)
              .clearCookie("accessToken",options)
              .clearCookie('refreshToken',options)
              .json(new apiResponse(200,{},'user logged out successfuly'))

    })
export { 
    registerUser,
    loginUser,
    logoutUser
};
