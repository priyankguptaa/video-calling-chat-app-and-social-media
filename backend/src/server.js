import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express()

const _dirname = path.resolve()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())



app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
    res.sendFile(path.join(_dirname,"../frontend","dist","index.html"));
    })
}

app.listen(process.env.PORT, ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
    connectDB()
})