"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "../styles/chat.css"
import { useRouter } from 'next/navigation'



const socket = io();


export const ChatMenu = ({name}) => {


  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [profile, setProfile] = useState("")
  const [image, setImage] = useState("")

  const router = useRouter()

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me")
setProfile(res.data.data.image)
}

useEffect(() => {
  getUserDetails()
},[])

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

    socket.on("private_message", ({from, message, profile}) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[from]) {
          newMessages[from] = [];
        }
        newMessages[from].push({ from, message, profile });
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
        socket.emit("register", name, profile);
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
      if (!image) {
        setImage(profile)
      }
    }
  };

  return (
    <div>
      <div className="chatContainer">
        
        {Object.keys(messages).map((chat, index) => (
    <div className="chatBox" key={index} onClick={() =>  router.push(`/profile/${name}/chatMenu/${chat}`)}>
      {messages[chat].length > 0 && (
        <img className="profilePicture" src={messages[chat][0].profile} />
      )}
      {chat}
    </div>
  ))}
  
        </div>
    </div>
  );
};
