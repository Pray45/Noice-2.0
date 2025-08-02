import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateOTP from "../utils/otpGenerate.js"
import OTP from "../models/OTP.model.js"
import { sendOTPEmail } from "../utils/mail.js"
import { registerSchema } from "../schemas/user.schema.js"
import { loginSchema } from "../schemas/user.schema.js"
import jwt from "jsonwebtoken"



//-------------------------------------------------Register-------------------------------------------------



export const registerUser = async (req, res) => {

  const zodData = registerSchema.safeParse(req.body)

  if (!zodData.success) {
    return res.status(400).json({
      success: false,
      message: "Error in data validation with Zod.",
      issues: zodData.error.errors,
    })
  }

  const { name, email, password } = zodData.data

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already registered.",
    })
  }

  const hashedPass = await bcrypt.hash(password, 12)

  const otp = generateOTP()

  try {
    await OTP.deleteOne({ email })

    await OTP.create({
      email,
      otp,
      userData: { name, email, password: hashedPass },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to store OTP. Please try again.",
      error: error.message,
    })
  }

  await sendOTPEmail(email, otp)

  return res.status(201).json({
    success: true,
    message: "OTP sent to email. Please verify to complete registration.",
  })
}

export const validateOTP = async (email, otp) => {
  const record = await OTP.findOne({ email, otp })
  if (!record) return false
  return true
};



//-------------------------------------------------login-------------------------------------------------



export const loginUser = async (req, res) => {
  const zodData = loginSchema.safeParse(req.body)

  if (!zodData.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      issues: zodData.error.errors,
    })
  }

  const { email, password } = zodData.data

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    })
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      name: user.name,
      email: user.email,
    },
  })
}



//-------------------------------------------------logout-------------------------------------------------



export const logoutUser = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
  })

  return res.status(200).json({ success: true, message: "Logged out." })

}



//-------------------------------------------------updateUser-------------------------------------------------



export const updateUser = async (req, res) => {
  try {
    const userId = req.userId
    const { name, password, avatar, currentPassword } = req.body

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: "Current password is required." })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password." })
    }

    const updateData = {}
    if (name) updateData.name = name
    if (avatar) updateData.avatar = avatar
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpiresAt")

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    })

  } catch (err) {
    console.error("Update user error:", err)
    res.status(500).json({ success: false, message: "Internal server error." })
  }
};



//-------------------------------------------------forgetpass-------------------------------------------------



export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: "Email not found" })

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    await sendOTPEmail(email, otp)

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
};



//-------------------------------------------------resetpass-------------------------------------------------



export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, otp })

    if (!user || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    user.password = hashed
    user.otp = null
    user.otpExpiresAt = null

    await user.save()

    res.status(200).json({ success: true, message: "Password reset successful" })
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error" })
  }
}