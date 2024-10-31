import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getDataFromToken = async (request) => {
  try {
    const token = request.cookies.get("token")?.value;
    console.log("Token retrieved:", token);

    if (!token) {
      throw new Error("Token not found");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded token:", decodedToken);
    return decodedToken.id;
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};