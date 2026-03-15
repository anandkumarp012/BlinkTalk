import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";


export const getUserForSiderbar = async ()=>{
    try{
        const userId = req.user._id;
        const filteredUser = await User.find({_id: {$ne: userId}}).select('-password');

        const unseenMessages = {}
    const promises = fileteredUser.map(async(user)=>{
        const message = await Message.findOne({senderId: user._id, receiverId: userId, seen: false})
        if(unseenMessages.length > 0){
            unseenMessages[user._id] = message,length;
        }
    })
    await Promise.all(promises);
    res.json({success: true, users: filteredUser, unseenMessages})
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


export const getMessages = async(req, res)=>{
    try{
        const {id} = req.params;
        await Message.updateMany(id, {seen: true})
        res.json({success: true})

    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// send message to selected user

export const sendMessage = async(req, res)=>{
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, message: newMessage})

    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}