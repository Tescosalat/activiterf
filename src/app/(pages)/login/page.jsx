"use client"

import bcrypt from 'bcryptjs';

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { usePathname } from 'next/navigation' 
import axios from "axios"
import { useRouter } from 'next/navigation'
import { AiOutlineUser } from 'react-icons/ai';
import { MdKey } from 'react-icons/md';
import "./loginSign.css"



export default function LoginPage() {
    const router = useRouter()
    const [user, setUser] = useState({
        username: "",
        password: "",
    })
    const [wrongLogin, setWrongLogin] = useState("hide")

    const wrongNameOrPassword = () => {
    setWrongLogin("show")
    }

const onLogin = async () => {
try {

   const response = await axios.post("/api/users/login", user)
   console.log(response);
   router.push(`/profile/${user.username}`)
    
} catch (error) {
    wrongNameOrPassword()
    console.log(error.message)
}
}


    return (
        <article>
            <img src="/images/back.png" alt="" className="back" draggable="false"/>
            
<div className="container">
           <img src="/images/logo.png" alt="" className="logol" draggable="false"/>
            

          <div className="input">
            <div className="icon">
            <AiOutlineUser />
            </div>
         
          <input 
            id="username" 
            type="text"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})} 
            placeholder="name"
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
      

<div className="buttonBack">
<button className="buttonLogin"
        onClick={onLogin}
        >
            sign in
        </button>
</div>
       

        <span>Don't have an account yet ?&nbsp;&nbsp;&nbsp; <Link href="/signup" className="sign">Signup</Link></span>
        <p className={wrongLogin}>*zlé meno alebo heslo</p>
        </div>

          
            
           

      
        </article>
       
    )
}