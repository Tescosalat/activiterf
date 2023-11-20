import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../model/userModel";
import { connect } from "../../../../dbConfig/dbConfig"


connect()

export async function GET(request) {
    try {
        const userId = await getDataFromToken(request)
        const user = await User.findOne({_id: userId}).select("-password")
        return NextResponse.json({
            message: "User found",
            data: user
        })
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}