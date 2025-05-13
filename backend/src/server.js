import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express()

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)


app.listen(process.env.PORT, ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
    connectDB()
})