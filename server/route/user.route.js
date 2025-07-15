import { Router } from 'express'
import { forgotPasswordController, getHostelsByuser, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controller/user.controller.js'
import auth from '../middleware/auth.js'

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.get('/verify-email/:code', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', logoutController)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetpassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)
userRouter.get('/profile', auth, (req, res) => {
    return res.json({
        message: "Profile data",
        success: true,
        data: req.user  // This will have the user data attached by the middleware
    });
});
userRouter.get('/get-hostel', auth, getHostelsByuser)



export default userRouter