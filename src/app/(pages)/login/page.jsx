"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { usePathname } from 'next/navigation' 
import axios from "axios"
import { useRouter } from 'next/navigation'
import { AiOutlineUser } from 'react-icons/ai';
import { MdKey } from 'react-icons/md';
import "./login.css"


export default function LoginPage() {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
    })

const onLogin = async () => {
try {

   const response = await axios.post("/api/users/login", user)
   router.push("/profile")
    
} catch (error) {
    console.log(error.message)
}
}



    return (
        <article>
             <div className="container">
            <h1>Login</h1>
            

          <div className="input">
            <div className="icon">
            <AiOutlineUser />
            </div>
         
          <input 
            id="email" 
            type="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})} 
            placeholder="email"
        />
          </div>
       
         

<div className="input">
    <div className="icon">
    <MdKey />
    </div>
<input 
            id="password" 
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})} 
            placeholder="password"
        />
</div>
      



        <button
        onClick={onLogin}
        >
            sign in
        </button>

        <Link href="/signup">Signup</Link>

        </div>
        </article>
       
    )
}