"use client"

import { Chat2 } from "../../../components/Chat2"
import  getCookie  from "../../../../helpers/getCookie";
import { useState, useEffect } from "react";

export default function Home() {

  const [name, setName] = useState("");

  useEffect(() => {
    setName(getCookie("name"));
  }, []);

  return (
    <div>
      <Chat2 name={name}/>
    </div>
  );
}
