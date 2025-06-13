import mongoose,{ Schema } from "mongoose";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new  Schema({
    username:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        
    },
    fullname:{
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    avtar:{
        type : String, //cloudinary url
        required : true,
    },
    coverImage:{
        type : String, //cloudinary url
    },
    whatcHistory:[{
        type : Schema.Types.ObjectId,
        ref : 'Video'
    }
    ],
    password:{
        type : String,
        required : [true,'password is require']
    },
    refreshToken:{
        type : String,
        required : true,
    },

},{
    timestamps:true
})

userSchema.pre('save',async (next)=>{
    if(!this.ismodifyed(password)) return next();
        this.password = await bcrypt.hash(this.password,10)
        next()
})
userSchema.method.isPasswordCorrect = async (password) => {
   return await bcrypt.compare(password,this.password)
}
userSchema.method,genrateAccessToken = async () =>{
    jwt.sign({
        _id : this.id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
userSchema.method.genrateRefreshToken = async () =>{

}

export const User = mongoose.model('User',userSchema)