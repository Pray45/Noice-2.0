import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    name: { type: String, required: true, minlength: 2},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    password: { type: String, required: true},
    provider: { type: String, enum: ['local', 'google', 'github'], default: 'local'},
    avatar: {type: String},
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User