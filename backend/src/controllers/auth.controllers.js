import { upsertStreamUser } from "../lib/stream.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export async function signup(req, res){
    const {email,password,fullname} = req.body
    try {
        if(!email || !password || !fullname){
            return res.status(404).json({message:"All fields are required"})
        }

        if(password.length<6){
            return res.status(404).json({message:"password should be of 6 character"})
        }

        const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

        if(!emailRegex.test(email)){
            return res.status(404).json({message:"invalid email format"})
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(404).json({message:"mail already exist"})
        }

        const idx = Math.floor(Math.random()*100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            email,
            fullname,
            password,
            profilePic:randomAvatar,
        })

        try {
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullname,
                image:newUser.profilePic || "",
            });
            console.log("stream user created")
        } catch (error) {
            console.log("error in creating stream user:", error)
        }

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({success:true, user:newUser})

    } catch (error) {
        console.log("Error in signup controller",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export async function signin(req, res){
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(404).json({message:"all fields are required"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({message:"Invalid mail or password"})
        }
        
        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect)
            return res.status(404).json({message:"Invalid mail or password"})
            
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({success:true,user})
        
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}
export function logout(req, res){
    res.clearCookie("jwt")
    res.status(200).json({success:true, message:"Logout successfully"})
}

export async function onboard(req,res){
    try {
        const userId = req.user._id;
        const {fullname, bio, nativeLanguage, learningLanguage, location} = req.body
        if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location ){
            return res.status(400).json({
                message:"all fields are required",
                missingFields:[
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded:true,
        },{new:true})

        if(!updatedUser) return res.status(404).json({message:"user not found"})

        try {
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullname,
                image:updatedUser.profilePic || ""
            })   
            console.log(`stream user updated for ${updatedUser.fullname}`)
        } catch (error) {
            console.log({message:"stream error while onboarding:", error})
        }


        res.status(200).json( {success:true, user:updatedUser})    
    } catch (error) {
        console.error("onboarding error:",error)
        res.status(500).json({message:"internal Sever error"})
    }
}