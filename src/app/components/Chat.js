"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const socket = io();

export const Chat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [room, setRoom] = useState(null);
  const [temp, setTemp] = useState(null)



  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  // Join room when room changes
  useEffect(() => {
    if (room) {
      socket.emit("joinRoom", room);
    }
  }, [room]);



  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", { message: messageInput.trim(), room });
      setMessageInput("");
    }
  };

  return (
    <div>
  
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>

    

      <input
        type="text"
        placeholder="room"
        onChange={(e) => setTemp(e.target.value)}
      />
      <button onClick={() => {socket.emit("leaveRoom", room); setRoom(temp)}}>room</button>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};
