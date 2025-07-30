import mongoose from "mongoose";

const dbConnect = async() => {

    if(!process.env.MONGO_URI)
        console.log("plese enter mongoDB UTI in .env")

    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully...")

    } catch (error) {

        console.log("failed to connect MongoDB : ", error)

    }

}

export default dbConnect