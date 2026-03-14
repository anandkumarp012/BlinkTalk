import express from 'express';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/check-auth', protectRoute,  checkAuth);
userRouter.put('/update-profile', protectRoute, updateProfile);


export default userRouter;