


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
    
}