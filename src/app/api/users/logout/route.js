import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Lougout successful",
      success: true,
    })
    response.cookies.set("token", "", { httpOnly: true })
    response.cookies.set("name", "", { httpOnly: true })
    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
