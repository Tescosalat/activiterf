"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const getUserDetails = async () => {
        const res = await axios.get("/api/users/me")
setData(res.data.data.image)
setLoading(false)
    }

    useEffect(() => {
        getUserDetails()
    },[])



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
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <img src={data} alt="" />
            <button onClick={logout}>Logout</button>
        </div>
    )
}