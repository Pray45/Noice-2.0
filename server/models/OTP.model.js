import mongoose from "mongoose";

const otpSchema = mongoose.Schema({

    email: { type: String, required: true, unique: true, index: true },
    otp: { type: String, required: true },
    userData: { type: Object, default: null }, 
    createdAt: { type: Date, default: Date.now, expires: 300 },
    
    
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;