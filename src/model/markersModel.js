import mongoose from "mongoose";

const markerSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: [true, "Provide lat"],
    },
    lng: {
        type: Number,
        required: [true, "Provide lng"],
    },
    icon: {
        type: Number,
        required: [true, "Provide icon"],
    },
    description: {
        type: String,
        required: [true, "Provide description"],
    },
    time: {
        type: String,
        required: [true, "Provide time"],
    },
    admin: {
        type: String,
        required: [true, "Provide admin"],
    },
    photo: {
        type: String,
        required: [true, "Provide photo"],
    },
    open: {
        type: Boolean,
        default: false
    }
})

const Marker = mongoose.models.markers || mongoose.model("markers", markerSchema)

export default Marker