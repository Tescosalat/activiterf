"use client"

import { useState, useEffect } from 'react';
import { ChatPage } from "../../../../../components/ChatPage";
import  getCookie  from "../../../../../../helpers/getCookie";
import { useParams } from 'next/navigation'

export default function Chat() {
  const [name, setName] = useState("");

  const params = useParams()

  useEffect(() => {
    setName(getCookie("name"));
  }, []);

  console.log(params.chat);


  return (
    <div>
      <ChatPage name={name} chat={params.chat}/>
    </div>
  );
}
