"use client"

import { MapGoogle } from "../../../components/MapGoogle"
import { ListOfActivity } from "../../../components/ListOfActivity"
import getCookie from "../../../../helpers/getCookie"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState("")
  const [markers, setMarkers] = useState([])

  const getAllMarkers = async () => {
    const res = await axios.get("/api/markers/markerGet")
    setMarkers(res.data.data)
  }

  useEffect(() => {
    getAllMarkers()
  }, [])

  useEffect(() => {
    setName(getCookie("name"))
  }, [])

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me")
    setPhoto(res.data.data.image)
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <div className="home-page">
      <div className="map-element">
        <MapGoogle name={name} photo={photo} />
      </div>
      <div className="list-element">
        <ListOfActivity markers={markers} name={name} />
      </div>
    </div>
  )
}
