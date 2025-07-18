import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import express from "express";

dotenv.config({
    path: './.env'
})
// const app = express();

const connectDB =async ()=>{
    try {
        // const connectrinstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        const connectrinstance = await mongoose.connect(`mongodb://localhost:27017/YOUTUBE`)
        console.log(`DB connected successfull || ${process.env.PORT}|| DB host ${connectrinstance.connection.host}`)
        // app.on('error',(error)=>{
        //     console.log( "DB note found",error)
        //     throw error
        // })
        // app.listen(process.env.PORT,()=>{
        //     console.log(`connect successfully db is runnig on ${process.env.PORT}`)
        // })
        
    } catch (error) {
        console.log("DB connection err",error)
        process.exit(1)
        throw error
    }

}
export default connectDB  