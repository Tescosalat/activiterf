"use client"

import React, { useState, useEffect } from "react"
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps"
import {
  MdOutlineSportsBar,
  MdOutlineSportsEsports,
  MdOutlineSportsBaseball,
  MdOutlineSportsFootball,
  MdOutlineSportsCricket,
  MdOutlineSportsBasketball,
  MdOutlineSportsMma,
  MdOutlineSportsHockey,
  MdOutlineSportsVolleyball,
  MdOutlineSportsTennis,
  MdDirectionsWalk,
} from "react-icons/md"
import { FaPassport, FaSwimmer, FaCoffee } from "react-icons/fa"
import { IoBicycleSharp, IoCloseOutline } from "react-icons/io5"
import { CgGym } from "react-icons/cg"
import axios from "axios"
import { io } from "socket.io-client"
import { useRouter } from "next/navigation"

const socket = io()

export const MapGoogle = ({ name, photo }) => {
  const router = useRouter()

  const [currentPosition, setCurrentPosition] = useState(null)
  const [markers, setMarkers] = useState([])
  const [tempMarker, setTempMarker] = useState(null)
  const [timeTemp, setTimeTemp] = useState("")
  const [iconTemp, setIconTemp] = useState(null)
  const [textTemp, setTextTemp] = useState("")
  const [activityMenu, setActivityMenu] = useState("hide-act-menu")
  const [chatPartners, setChatPartners] = useState([])

  const icons = [
    <MdOutlineSportsBar />,
    <MdOutlineSportsEsports />,
    <MdOutlineSportsBaseball />,
    <MdOutlineSportsFootball />,
    <MdOutlineSportsCricket />,
    <MdOutlineSportsBasketball />,
    <MdOutlineSportsMma />,
    <MdOutlineSportsHockey />,
    <MdOutlineSportsVolleyball />,
    <MdOutlineSportsTennis />,
    <FaPassport />,
    <FaSwimmer />,
    <FaCoffee />,
    <IoBicycleSharp />,
    <CgGym />,
    <MdDirectionsWalk />,
  ]

  console.log(timeTemp)

  useEffect(() => {
    socket.on("chat_partners", (partners) => {
      setChatPartners(partners)
    })

    socket.on("new_chat_partner", (newPartner) => {
      setChatPartners((prevPartners) => {
        if (!prevPartners.includes(newPartner) && newPartner !== name) {
          return [{ ...prevPartners }, { newPartner }]
        }
        return prevPartners
      })
    })

    return () => {
      socket.off("chat_partners")
      socket.off("new_chat_partner")
    }
  }, [name])

  useEffect(() => {
    if (name) {
      socket.emit("register", name)
    }
  }, [name])

  const handleAddToChat = (chatPartner) => {
    if (chatPartners.includes(chatPartner))
      return router.push(`/profile/${name}/chatMenu/${chatPartner}`)

    socket.emit("private_message", {
      to: chatPartner,
      message: `${name} wants to join`,
    })

    if (!chatPartners.includes(chatPartner)) {
      socket.emit("new_chat_partner", chatPartner)
    }

    router.push(`/profile/${name}/chatMenu/${chatPartner}`)
  }

  const getAllMarkers = async () => {
    const res = await axios.get("/api/markers/markerGet")
    setMarkers(res.data.data)
  }

  const handleDeleteMarker = async (id) => {
    try {
      await axios.delete(`/api/markers/markerDelete?id=${id}`)
      getAllMarkers()
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    getAllMarkers()
    const intervalId = setInterval(() => {
      getAllMarkers()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  const renderIcon = (icon, size) => {
    return React.cloneElement(icon, { style: { fontSize: size } })
  }

  const toggleInfoWindow = (index) => {
    setMarkers((current) =>
      current.map((marker, i) =>
        i === index ? { ...marker, open: !marker.open } : marker,
      ),
    )
  }

  const createEvent = async () => {
    if (!iconTemp && !iconTemp === 0) return alert("icon is missing")
    if (!textTemp) return alert("description is missing")
    if (!timeTemp) return alert("time is missing")
    try {
      const markerData = {
        lat: tempMarker.lat,
        lng: tempMarker.lng,
        icon: iconTemp,
        description: textTemp,
        time: timeTemp,
        admin: name,
        photo: photo,
        open: false,
      }

      await axios.post("/api/markers/markerPost", markerData)
    } catch (error) {
      console.log(error.message)
    }

    setTempMarker(null)
    setTextTemp("")
    setTimeTemp("")
    setIconTemp(null)
    setActivityMenu("hide-act-menu")
    getAllMarkers()
  }

  const onMapClick = (e) => {
    setActivityMenu("show-act-menu")

    setTempMarker({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS}>
      <div className={activityMenu}>
        <h1>Which activity are you interested in? Choose your icon:</h1>
        <button
          className="exit-button"
          onClick={() => setActivityMenu("hide-act-menu")}
        >
          <IoCloseOutline />
        </button>
        <div className="icon-container-activity">
          {icons.map((icon, index) => (
            <button
              key={index}
              className={index === iconTemp ? "selected" : ""}
              onClick={() => setIconTemp(icons.indexOf(icon))}
            >
              {icons[icons.indexOf(icon)]}
            </button>
          ))}
          <div className="bottom-div"></div>
        </div>
        <div className="time">
          <h1>When ?</h1>
          <input
            onChange={(e) => setTimeTemp(e.target.value)}
            className="time-input"
            type="date"
          />
        </div>
        <h1>Tell the world about your plans:</h1>
        <textarea
          value={textTemp}
          onChange={(e) => setTextTemp(e.target.value)}
          className="describe-field"
        />
        <div className="div-for-button">
          <button onClick={createEvent} className="create-event-button">
            Create Event
          </button>
        </div>
      </div>

      <div style={{ height: "100%", width: "100%" }}>
        {currentPosition ? (
          <Map
            defaultZoom={13}
            defaultCenter={currentPosition}
            mapId={process.env.NEXT_PUBLIC_MAPSID}
            disableDefaultUI={true}
            draggingCursor="pointer"
            draggableCursor="crosshair"
            onClick={onMapClick}
          >
            <AdvancedMarker position={currentPosition} gmpDraggable={false}>
              <Pin>
                <p style={{ fontSize: "12px" }}>Me</p>
              </Pin>
            </AdvancedMarker>
            {markers.map((marker, index) => (
              <div key={index}>
                <AdvancedMarker
                  position={{
                    lat: marker.lat,
                    lng: marker.lng,
                  }}
                  onClick={() => toggleInfoWindow(index)}
                >
                  <Pin
                    background={name === marker.admin ? "white" : "#83f28f"}
                    borderColor="black"
                    scale={1.4}
                  >
                    {renderIcon(icons[marker.icon], "40px")}
                  </Pin>
                </AdvancedMarker>
                {marker.open && (
                  <InfoWindow
                    onCloseClick={() => toggleInfoWindow(index)}
                    position={{ lat: marker.lat, lng: marker.lng }}
                  >
                    <div className="info-window">
                      <div className="photo-name">
                        <div className="name-date">
                          <p>{marker.admin}</p>
                          <p className="time-text">{marker.time}</p>
                        </div>
                        <img src={marker.photo} />
                      </div>
                      <div className="description">
                        <p>{marker.description}</p>
                      </div>
                      {marker.admin !== name ? (
                        <div className="div-for-button2">
                          <button
                            className="create-event-button2"
                            onClick={() => handleAddToChat(marker.admin)}
                          >
                            Join
                          </button>
                        </div>
                      ) : (
                        <div className="div-for-button2">
                          <button
                            className="buttonBackReg"
                            onClick={() => handleDeleteMarker(marker._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </div>
            ))}
          </Map>
        ) : (
          <p>Loading current location...</p>
        )}
      </div>
    </APIProvider>
  )
}
