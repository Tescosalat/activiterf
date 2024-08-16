"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { TbDoorExit } from "react-icons/tb"
import { FiMessageCircle } from "react-icons/fi"

export default function Navbar() {
  const [profile, setProfile] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(false)
  const router = useRouter()

  const pathname = usePathname()


  const regex = /^\/profile\/[^\/]+\/chatMenu\/.*$/
  const isProfileChatMenu = regex.test(pathname)

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me")
    if (res.data && res.data.data) {
      setProfile(res.data.data.image);
      setName(res.data.data.username);
    } else {
      console.error("User data is null or undefined");
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  const settingsHandler = () => {
    setSettings(!settings)
  }

  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      router.push("/login")
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <div className="navbar" id={isProfileChatMenu ? "hide-shadow" : "navbar"}>
        <Link href="/profile">
          <img src="/images/logo.png" alt="" className="logo" />
        </Link>
        <div className="nameAndPhoto">
          <div className="icon-container">
            <Link href={`/profile/${name}/chatMenu`}>
              <FiMessageCircle className="message-icon" />
            </Link>
          </div>
          <p className="name">{name}</p>

          <div onClick={settingsHandler} className="photoSet">
            {loading ? (
              <p>loading</p>
            ) : (
              <img
                src={profile}
                alt="profilepicture"
                className="profilePicture"
              />
            )}
            <IoIosArrowDown className="arrowIcon" />
          </div>

          <div className={settings ? "setShow" : "setHide"}>
            <div className="button" onClick={logout}>
              <TbDoorExit className="exit" />

              <button className="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
