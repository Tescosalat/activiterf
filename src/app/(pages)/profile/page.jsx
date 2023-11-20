"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {


    const [profile, setProfile] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true)
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
           
            <p>Profile page</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum tempora error nam corrupti aut porro culpa! Aperiam autem blanditiis reiciendis nobis, eveniet obcaecati magni nemo dolorem assumenda repudiandae sint rerum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum tempora error nam corrupti aut porro culpa! Aperiam autem blanditiis reiciendis nobis, eveniet obcaecati magni nemo dolorem assumenda repudiandae sint rerum?</p>
        <h1>DACO</h1>
        <p>Lorem</p>
        <img src="https://travelaway.nl/wp-content/uploads/2021/12/Medellin-2-scaled-1024x576.jpg" alt="" />
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem earum necessitatibus laboriosam aut aspernatur explicabo modi, natus obcaecati fuga esse tenetur maiores voluptatem minus corporis eligendi recusandae velit. Delectus, exercitationem!</p>
        <h1>TAM</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex incidunt consectetur culpa. Ea officia ratione corporis assumenda sint provident saepe, nesciunt adipisci voluptatum consequatur, numquam iste, itaque at facere minus!</p>

      
      



            <button onClick={logout}>Logout</button>
        </div>
        
    )
}