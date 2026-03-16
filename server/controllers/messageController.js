import Message from '../models/messages.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';
import { io, userSocketMap } from '../server.js';


export const getUserForSiderbar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const count = await Message.countDocuments({ senderId: user._id, receiverId: userId, seen: false });
            unseenMessages[user._id] = count;
        });

        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


export const getMessages = async(req, res)=>{
    try{
        const { id } = req.params;
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: id },
                { senderId: id, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        await Message.updateMany({ senderId: id, receiverId: userId }, { seen: true });
        res.json({ success: true, messages });

    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
};

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
};