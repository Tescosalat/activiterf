import { NextRequest, NextResponse } from "next/server";
import User from "../../../../model/userModel";
import { connect } from "../../../../dbConfig/dbConfig"


connect()

export async function GET(request) {
    try {
        
        const users = await User.find()
        return NextResponse.json({
            data: users
        })
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}