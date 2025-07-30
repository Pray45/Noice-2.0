import express from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updateUser } from "../controllers/auth.controller.js";
import verifyOTP from "../controllers/otp.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/update", authMiddleware ,updateUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;