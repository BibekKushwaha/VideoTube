// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

// const app = express();

// (
//     async()=>{
//         try {
//             await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//             app.on("error",(error)=>{
//                 console.log("app listening on error" , error);
//                 throw error;
//             })
//             app.listen(process.env.PORT,()=>{
//                 console.log(`app is listening on port ${process.env.PORT}` );
                
//             })
//         } catch (error) {
//             console.log("database connection failed",error);
//             throw error;
//         }

//     }
// )()
import dotenv from "dotenv"
import connectDb from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDb();