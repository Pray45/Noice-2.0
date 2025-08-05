import express from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updateUser } from "../controllers/auth.controller.js";
import verifyOTP from "../controllers/otp.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { zodValidate } from "../middlewares/Zod.middleware.js";
import { loginSchema, otpVerifySchema, registerSchema, resetPasswordSchema, updateUserSchema } from "../schemas/user.schema.js";


const authRouter = express.Router();

authRouter.post("/register", zodValidate(registerSchema), registerUser);
authRouter.post("/login", zodValidate(loginSchema), loginUser);
authRouter.put("/update", zodValidate(updateUserSchema), authMiddleware ,updateUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", zodValidate(resetPasswordSchema), resetPassword);
authRouter.post("/verify-otp", zodValidate(otpVerifySchema), verifyOTP);

export default authRouter;