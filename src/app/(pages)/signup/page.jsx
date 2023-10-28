"use client"

import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"


export default function SignupPage() {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
        image: "",
    })
  

const onSignup = async () => {
try {

   const response = await axios.post("/api/users/signup", user)
   router.push("/login")
    
} catch (error) {
    console.log(error.message)
} 


}


    return (
        <div>
            <h1>signup</h1>
            <hr />
            <label htmlFor="username">username</label>
        <input 
            id="username" 
            type="text"
            value={user.name}
            onChange={(e) => setUser({...user, username: e.target.value})} 
            placeholder="username"
        />

<label htmlFor="password">password</label>
        <input 
            id="password" 
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})} 
            placeholder="password"
        />

<label htmlFor="email">email</label>
        <input 
            id="email" 
            type="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})} 
            placeholder="email"
        />

<input 
            id="image" 
            type="text"
            value={user.image}
            onChange={(e) => setUser({...user, image: e.target.value})} 
            placeholder="image"
        />

        <button
        onClick={onSignup}
        >
            Signup
        </button>

        <Link href="/login">login</Link>

        </div>
    )
}