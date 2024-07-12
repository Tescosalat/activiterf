import { NextRequest, NextResponse } from "next/server";
import Marker from "../../../../model/markersModel";
import { connect } from "../../../../dbConfig/dbConfig"


connect()

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedMarker = await Marker.findByIdAndDelete(id);
        return NextResponse.json({
            message: "Marker deleted successfully",
            data: deletedMarker
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
