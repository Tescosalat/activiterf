"use client"

import { Chat } from "../../../components/Chat"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Home() {

  const [profile, setProfile] = useState("")
  const [name, setName] = useState("")

const getUserDetails = async () => {
      const res = await axios.get("/api/users/me")
setProfile(res.data.data.image)
setName(res.data.data.username)
  }

  useEffect(() => {
      getUserDetails()
  },[])


  return (
    <div>
      <Chat name={name}/>
    </div>
  );
}
