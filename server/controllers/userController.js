import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import bcrypt from 'bcrypt';


export const signup = async ()=>{
    const { fullName, email, password, bio} = req.body;


    try{
        if(!fullName || !email || !password ||!bio){
            return res.json({success: false, message: "Please fill all the fields"});
        }
        const user  =  await User.findOne({email});
        if(user){
            return res.json({success: false, message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, token, message: "Account created successfully"}); 
    }catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const login = async (req, res)=>{
    try{
        const { email, password } = req.body;
        const userData = await User.findOne({email});
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if(!isPasswordMatch){
            return res.json({success: false, message: "Invalid credentials"});
        }
        const token = generateToken(userData._id);
        res.json({success: true, userData, token, message: "Login successful"});
    }
    catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// controller to check if user authenticated or not

export const checkAuth = async (req, res)=>{
    res.json({success: true, user: req.user});
}


export const updateProfile = async (req, res)=>{
    try{
        const { profilPic, fullName, bio} = req.body;
        const userId = req.user._id;
        let updatedData;

        if(!profilPic){
            await User.findByIdAndUpdate(userId, {fullName, bio}, {new: true}); 
        }
        else{
            const upload = await cloudinary.uploader.upload(profilPic);{
                updatedData = await User.findByIdAndUpdate(userId, {fullName, bio, profilPic: upload.secure_url}, {new: true});
        }
    }
    res.json({success: true, user: updatedUser});
}
    catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}