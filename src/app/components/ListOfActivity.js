"use client"

import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useRouter } from "next/navigation"

const socket = io("https://activ-server-bxic.onrender.com")

export const ListOfActivity = ({ markers, name }) => {
  const router = useRouter()

  const [chatPartners, setChatPartners] = useState([])

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

  return (
    <div className="list-container">
      {markers
        .filter((marker) => marker.admin !== name)
        .map((marker, index) => (
          <div className="individual-element" key={index}>
            <div className="photo-button">
              <div className="photo-name-list">
                <img className="profile" src={marker.photo} alt="" />
                <div>
                  <p>{marker.admin}</p>
                  <p className="list-time">{marker.time}</p>
                </div>
              </div>
              <div>
                {
                  <div className="div-for-button2">
                    <button
                      className="create-event-button2"
                      onClick={() => handleAddToChat(marker.admin)}
                    >
                      Join
                    </button>
                  </div>
                }
              </div>
            </div>
            <div className="text-container">
              <p className="list-description">{marker.description}</p>
            </div>
          </div>
        ))}
    </div>
  )
}
