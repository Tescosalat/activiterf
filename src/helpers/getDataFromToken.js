import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("token")?.value || ""
    console.log("Token retrieved:", token);
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    console.log("Decoded token:", decodedToken);
    return decodedToken.id
  } catch (error) {
    console.log("token error")
  }
}
