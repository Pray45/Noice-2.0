import jwt from "jsonwebtoken";
import OTP from "../models/OTP.model.js";
import User from "../models/user.model.js";
import { validateOTP } from "./auth.controller.js";

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required.",
    });
  }

  const isValid = await validateOTP(email, otp);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP or expired.",
    });
  }

  const record = await OTP.findOne({ email, otp });

  if (!record || !record.userData) {
    return res.status(400).json({
      success: false,
      message: "OTP record not found or missing user data.",
    });
  }

  const { name, password } = record.userData;

  const user = await User.create({ name, email, password });

  await OTP.deleteOne({ _id: record._id });


  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });


  return res.status(201).json({
    success: true,
    message: "Registration complete.",
  });
};

export default verifyOTP;