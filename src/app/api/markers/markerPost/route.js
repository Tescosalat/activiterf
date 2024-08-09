import { connect } from "../../../../dbConfig/dbConfig"
import Marker from "../../../../model/markersModel"
import { NextResponse } from "next/server"

connect()

export async function POST(request) {
  try {
    const reqBody = await request.json()
    const { lat, lng, icon, description, time, admin, photo, open } = reqBody

    const newMarker = new Marker({
      lat,
      lng,
      icon,
      description,
      time,
      admin,
      photo,
      open,
    })

    const savedMarker = await newMarker.save()

    return NextResponse.json({
      message: "created",
      success: true,
      savedMarker,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
