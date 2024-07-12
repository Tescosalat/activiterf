"use client"

import { useState, useEffect } from 'react';
import { ChatMenu } from "../../../../components/ChatMenu";
import  getCookie  from "../../../../../helpers/getCookie";

export default function ChatMenuPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getCookie("name"));
  }, []);

  return (
    <div>
      <ChatMenu name={name} />
    </div>
  );
}
