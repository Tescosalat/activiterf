import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection

        connection.on("conect", () => {
            console.log("DB connected")
        })
    } catch (error) {
        console.log("smth wrong")
        console.log(error)
    }
}