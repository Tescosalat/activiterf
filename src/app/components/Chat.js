"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const socket = io();

export const Chat = ({name}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [recipient, setRecipient] = useState("");

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

    socket.on("private_message", ({from, message}) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[from]) {
          newMessages[from] = [];
        }
        newMessages[from].push({ from, message });
        return newMessages;
      });
      console.log(`Message from ${from}: ${message}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("private_message");
    };
  }, []);

  useEffect(() => {
    if (name) {
        socket.emit("register", name);
    }
  }, [name]); 

  const sendMessage = () => {
    if (messageInput.trim() !== "" && (currentChat || recipient)) {
      const to = currentChat || recipient;
      socket.emit("private_message", { to, message: messageInput.trim() });
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[to]) {
          newMessages[to] = [];
        }
        newMessages[to].push({ from: name, message: messageInput.trim() });
        return newMessages;
      });
      setMessageInput("");
      if (!currentChat) {
        setCurrentChat(to);
      }
    }
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>

      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
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

      <div>
        {currentChat && messages[currentChat] ? (
          messages[currentChat].map((message, index) => (
            <div key={index}>
              <strong>{message.from}:</strong> {message.message}
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>

      <div>
        <h3>Open Chats</h3>
        {Object.keys(messages).map((chat, index) => (
          <button key={index} onClick={() => setCurrentChat(chat)}>
            {chat}
          </button>
        ))}
      </div>
    </div>
  );
};
