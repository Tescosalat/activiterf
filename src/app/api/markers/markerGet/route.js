import { NextResponse } from "next/server"
import Marker from "../../../../model/markersModel"
import { connect } from "../../../../dbConfig/dbConfig"

connect()

export async function GET(request) {
  try {
    const markers = await Marker.find()
    return NextResponse.json({
      data: markers,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
