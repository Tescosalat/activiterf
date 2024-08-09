"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import axios from "axios"

const socket = io()

export const Chat2 = ({ name }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState({})
  const [messageInput, setMessageInput] = useState("")
  const [currentChat, setCurrentChat] = useState(null)
  const [recipient, setRecipient] = useState("")
  const [chatPartners, setChatPartners] = useState([])
  const [userData, setUserData] = useState(null)

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/all")
    setUserData(res.data.data)
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true)
    }

    socket.on("connect", () => {
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("private_message", ({ from, to, message }) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages }
        if (!newMessages[from]) {
          newMessages[from] = []
        }
        if (!newMessages[to]) {
          newMessages[to] = []
        }
        newMessages[from].push({ from, message })
        newMessages[to].push({ from, message })
        return newMessages
      })
    })

    socket.on("previous_messages", (fetchedMessages) => {
      const newMessages = {}
      fetchedMessages.forEach(({ from, to, message }) => {
        if (!newMessages[from]) {
          newMessages[from] = []
        }
        if (!newMessages[to]) {
          newMessages[to] = []
        }
        newMessages[from].push({ from, message })
        newMessages[to].push({ from, message })
      })
      setMessages(newMessages)
    })

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
      socket.off("connect")
      socket.off("disconnect")
      socket.off("private_message")
      socket.off("previous_messages")
      socket.off("chat_partners")
      socket.off("new_chat_partner")
    }
  }, [name])

  useEffect(() => {
    if (name) {
      socket.emit("register", name)
    }
  }, [name])

  useEffect(() => {
    if (currentChat) {
      socket.emit("fetch_messages", currentChat)
    }
  }, [currentChat])

  const sendMessage = () => {
    if (messageInput.trim() !== "" && currentChat) {
      socket.emit("private_message", {
        to: currentChat,
        message: messageInput.trim(),
      })
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentChat]: [
          ...(prevMessages[currentChat] || []),
          { from: name, message: messageInput.trim() },
        ],
      }))
      setMessageInput("")

      if (!chatPartners.includes(currentChat)) {
        setChatPartners((prevPartners) => [...prevPartners, currentChat])
      }
    }
  }

  const handleAddToChat = (chatPartner) => {
    if (chatPartner !== name && chatPartner.trim() !== "") {
      setCurrentChat(chatPartner)
      setRecipient(chatPartner)

      socket.emit("private_message", { to: chatPartner, message: "" })

      if (!chatPartners.includes(chatPartner)) {
        socket.emit("new_chat_partner", chatPartner)
      }
    }
  }

  const handleSend = () => {
    sendMessage()
  }
  console.log(chatPartners)
  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>

      <div>
        <input
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button onClick={() => handleAddToChat(recipient)}>Add</button>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage()
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <div>
        <h3>Messages</h3>
        {currentChat && messages[currentChat] ? (
          messages[currentChat].map(({ from, message }, index) => (
            <div key={index}>
              <strong>{from}:</strong> {message}
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>
    </div>
  )
}
