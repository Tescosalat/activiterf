import { connect } from "../../../../dbConfig/dbConfig"
import User from "../../../../model/userModel"
import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request) {
  const isEmail = (usernameEmail) => {
    for (let i = 0; i < usernameEmail.length; i++) {
      if (usernameEmail[i] === "@") {
        return true
      }
    }
    return false
  }

  try {
    const reqBody = await request.json()
    const { username, password } = reqBody
    const emailResult = isEmail(username)

    const user = await User.findOne(
      emailResult ? { email: username } : { username: username },
    )

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 },
      )
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password or name" },
        { status: 400 },
      )
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    }
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "10d",
    })

    const response = NextResponse.json({
      message: "Login success",
      success: true,
    })
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      path: "/", 
    });
    response.cookies.set("name", user.username, {
      path: "/",
    });

    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
