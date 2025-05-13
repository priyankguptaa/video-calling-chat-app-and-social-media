import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js";

export const getRecommendedUsers = async (req,res)=>{
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user

        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne: currentUserId}},
                {$id:{$nin: currentUser.friends}},
                {isOnboarded:true},
            ]
        })
        res.status(200).json({recommendedUsers})
    } catch (error) {
        console.error("error in get recommendation Controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }

}

export const getMyFriends = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends","fullname profilePic nativeLanguage learningLanguage");

        req.status(200).json(user.friends)

    } catch (error) {
        console.error("error in get recommendation Controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params
        
        if(myId === recipientId){
            return res.status(400).json({ message:"you can't send friend request to yourself"})
        }
        
        const recipient = await User.findById(recipientId)

        if(!recipient){
            return res.status(404).json({ message:"reciepient doesnot found"})     
        }

        if(recipient.friends.include(myId)){
            return res.status(404).json({message:"you are already friends with this user"})
        }
        
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipientId},
                {sender:recipientId, recipientId:myId}
            ],
        })
        
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exist between you this user"})

        }
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        })

        res.status(200).json(friendRequest)

    } catch (error) {
        console.error("error in send friend request Controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}
export const acceptFriendRequest = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}