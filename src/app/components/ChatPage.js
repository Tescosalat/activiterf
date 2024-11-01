"use client"

import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import { LuSend } from "react-icons/lu"
import axios from "axios"

const socket = io("https://activ-server-bxic.onrender.com")

const timeStampFunction = (time) => {
  if (!!time) {
    return time.split("").splice(11, 5).join("")
  }
}

export const ChatPage = ({ name, chat }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState({})
  const [messageInput, setMessageInput] = useState("")
  const [currentChat, setCurrentChat] = useState(chat)
  const [chatPartners, setChatPartners] = useState([])
  const [userData, setUserData] = useState([])

  const chatContainerRef = useRef(null)
  const hasRegistered = useRef(false)

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/all")
    setUserData(res.data.data)
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  const targetUsername =
    name !== Object.keys(messages)[1]
      ? Object.keys(messages)[1]
      : Object.keys(messages)[0]
  const targetUser = userData.find((user) => user.username === targetUsername)

  const userToName = targetUser?.username || ""
  const userToImage = targetUser?.image || ""

  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true)
    }

    socket.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to socket")

      if (name && !hasRegistered.current) {
        socket.emit("register", name)
        hasRegistered.current = true
      }
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from socket")
      hasRegistered.current = false
    })

    socket.on("private_message", ({ from, to, message }) => {
      console.log(`Received private message from ${from} to ${to}: ${message}`)
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
      fetchedMessages.forEach(({ from, to, message, timestamp }) => {
        if (!newMessages[from]) {
          newMessages[from] = []
        }
        if (!newMessages[to]) {
          newMessages[to] = []
        }
        newMessages[from].push({ from, message, timestamp })
        newMessages[to].push({ from, message, timestamp })
      })
      setMessages(newMessages)
    })

    socket.on("chat_partners", (partners) => {
      setChatPartners(partners)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("private_message")
      socket.off("previous_messages")
      socket.off("chat_partners")
    }
  }, [name])

  useEffect(() => {
    if (name && isConnected) {
      console.log(`Registering user: ${name}`)
      socket.emit("register", name)
    }
  }, [name, isConnected])

  useEffect(() => {
    if (currentChat && isConnected) {
      socket.emit("fetch_messages", currentChat)
    }
  }, [currentChat, isConnected])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

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

  const handleSend = (e) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div>
      <div className="chat-panel">
        <img src={userToImage} />
        <p>{userToName}</p>
      </div>
      <div className="wholeChatContainer">
        <div className="chatPageContainer" ref={chatContainerRef}>
          {chat && messages[chat] ? (
            messages[chat].map(({ from, message, timestamp }, index) => (
              <div key={index}>
                <div className={from === chat ? "receiver" : "sender"}>
                  <span className="centerTime">
                    {message}
                    <p className="timestamp">{timeStampFunction(timestamp)}</p>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <div className="sendAndInput">
          <input
            className="input-text"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
          />
          <button onClick={handleSend}>
            <span>
              <LuSend className="arrowIcon" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
