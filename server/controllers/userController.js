import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: 'Please fill all the fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);
        const userData = await User.findById(newUser._id).select('-password');

        return res.json({ success: true, userData, token, message: 'Account created successfully' });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        const userData = await User.findById(user._id).select('-password');

        return res.json({ success: true, userData, token, message: 'Login successful' });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    return res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, bio } = req.body;
        const userId = req.user._id;

        const updateData = { fullName, bio };

        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = upload.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

        return res.json({ success: true, user: updatedUser, message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};