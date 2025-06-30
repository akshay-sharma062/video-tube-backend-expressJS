import dotenv from "dotenv"
import connectDB from "./db/dbConfig.js";
import { app } from "./app.js";
dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    app.on("ERROR",(error)=>{
        console.log(error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` Server is runnig on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Server CONNECTION ERROR",err)
});
