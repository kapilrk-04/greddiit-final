//mongodb+srv://admin:<password>@details.ts7k2qw.mongodb.net/?retryWrites=true&w=majority
import mongoose  from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Error in connecting to MongoDB: ", error);
    }

}
