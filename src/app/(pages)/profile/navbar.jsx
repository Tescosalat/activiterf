"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "./navbar.css"
import { IoIosArrowDown } from 'react-icons/Io';
import { TbDoorExit } from 'react-icons/Tb';





export default function Navbar() {
    const [profile, setProfile] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(false)
    const router = useRouter()

   

    const getUserDetails = async () => {
        const res = await axios.get("/api/users/me")
setProfile(res.data.data.image)
setName(res.data.data.username)
setLoading(false)
    }

    useEffect(() => {
        getUserDetails()
    },[])

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
    <div className="navbar">
    <Link href="/profile">
    <img src="/images/logo.png" alt="" className="logo" />
    </Link>
    <div className="nameAndPhoto">
        <p className="name">{name}</p>
         
        <div onClick={settingsHandler} className="photoSet">
            {loading ? <p>loading</p> : <img 
            src={profile} 
            alt="profilepicture" 
            className="profilePicture"
             />}
            <IoIosArrowDown className="arrowIcon"/>
        </div>
         
     
        
         <div className={settings ? "setShow" : "setHide"}>
            <div className="button" onClick={logout}>
            <TbDoorExit className="exit"/>
            
            <button className="logout">Logout</button>
            
            
            </div>
         
         </div>
    </div>
   
    </div>
</div>
       
        
    )
    
}