"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import axios from "axios";
import "../styles/chatMenu.css"
import { TbContainer } from "react-icons/Tb";

const socket = io();


export const ChatMenu = ({ name }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const [userData, setUserData] = useState([])

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/all")
    setUserData(res.data.data)
}

console.log(messages);

useEffect(() => {
  getUserDetails()
},[])


  const router = useRouter()
  const pathname = usePathname()


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

    socket.on("private_message", ({ from, to, message }) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        if (!newMessages[from]) {
          newMessages[from] = [];
        }
        if (!newMessages[to]) {
          newMessages[to] = [];
        }
        newMessages[from].push({ from, message });
        newMessages[to].push({ from, message });
        return newMessages;
      });
    });

    socket.on("previous_messages", (fetchedMessages) => {
      const newMessages = {};
      fetchedMessages.forEach(({ from, to, message }) => {
        if (!newMessages[from]) {
          newMessages[from] = [];
        }
        if (!newMessages[to]) {
          newMessages[to] = [];
        }
        newMessages[from].push({ from, message });
        newMessages[to].push({ from, message });
      });
      setMessages(newMessages);
    });

    socket.on("chat_partners", (partners) => {
      setChatPartners(partners);
    });

    socket.on("new_chat_partner", (newPartner) => {
      setChatPartners((prevPartners) => {
        if (!prevPartners.includes(newPartner) && newPartner !== name) {
          return [...prevPartners, newPartner];
        }
        return prevPartners;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("private_message");
      socket.off("previous_messages");
      socket.off("chat_partners");
      socket.off("new_chat_partner");
    };
  }, [name]);

  useEffect(() => {
    if (name) {
      socket.emit("register", name);
    }
  }, [name]);

  useEffect(() => {
    if (currentChat) {
      socket.emit("fetch_messages", currentChat);
    }
  }, [currentChat]);



  const handleAddToChat = (chatPartner) => {
router.push(`${pathname}/${chatPartner}`)
  };


  return (
    <div className="chat-row-container">
    {chatPartners
      .filter((chatPartner) => chatPartner !== name && chatPartner !== undefined)
      .map((chatPartner, index) => {
        const userDetail = userData.find(
          (user) => user.username === chatPartner
        );

        return (
          <div key={index} onClick={() => handleAddToChat(chatPartner)} className="chat-row">
            {userDetail && (
              <img
                src={userDetail.image}
                className="chat-par-image"
              />
            )}
              <p>{chatPartner}</p>
          </div>
        );
      })}
  </div>
  );
};
