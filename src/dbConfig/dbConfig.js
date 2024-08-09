import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const connection = mongoose.connection

    connection.on("connect", () => {
      console.log("DB connected")
    })
  } catch (error) {
    console.log("smth wrong")
    console.log(error)
  }
}
