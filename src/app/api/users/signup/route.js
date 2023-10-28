import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../model/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

connect()

export async function POST(request) {
    try {
        
        const reqBody = await request.json()
        const {username, email, password, image} = reqBody
        console.log(reqBody)
        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json({error: "already exist"}, {status: 400})
        }

const salt = await bcryptjs.genSalt(10)
const hashedPassword = await bcryptjs.hash
(password, salt)

const newUser = new User({
    username,
    email,
    image,
    password: hashedPassword
})

const savedUser = await newUser.save()

return NextResponse.json({
    message: "created",
    success: true,
    savedUser,
    })


    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}