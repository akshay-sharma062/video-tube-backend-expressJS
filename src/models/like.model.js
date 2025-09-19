import mongoose , { Schema} from 'mongoose'

const likeSchema = new Schema(
    {
        comment:{
            type : Schema.types.ObjectId,
            ref : 'Comment'
        },
        video:{
            type: Schema.types.ObjectId,
            ref: 'Video'
        },
        likedBy:{
            type:Schema.types.ObjectId,
            ref: 'User'
        },
        tweet:{
            type:Schema.types.ObjectId,
            ref:"Tweet" 
        }
    },
    {
        timestamps:true
    }
)

export const Like = mongoose.model('Like',likeSchema)