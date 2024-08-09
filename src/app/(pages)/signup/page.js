"use client"

import Link from "next/link"
import React, { useState } from "react"
import axios from "axios"
import { storage } from "../../../../firebaseDb"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useRouter } from "next/navigation"
import { AiOutlineUser } from "react-icons/ai"
import { MdKey } from "react-icons/md"
import { BsFillEnvelopeFill } from "react-icons/bs"
import { MdAddPhotoAlternate } from "react-icons/md"

export default function LoginPage() {
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    image: "",
  })

  const onSignup = async () => {
    try {
      if (!image) {
        console.log("Please select an image.")
        return
      }

      const storageRef = ref(storage, `profile-pictures/${image.name}`)
      await uploadBytes(storageRef, image)
      const imageUrl = await getDownloadURL(storageRef)

      const userData = {
        email: user.email,
        password: user.password,
        username: user.username,
        image: imageUrl,
      }

      await axios.post("/api/users/signup", userData)

      router.push("/login")
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
  }

  return (
    <article>
      <img src="/images/back2.png" alt="" className="back2" draggable="false" />

      <div className="container">
        <img
          src="/images/logo.png"
          alt=""
          className="logol"
          draggable="false"
        />

        <label htmlFor="username" className="input">
          <div className="icon">
            <AiOutlineUser />
          </div>
          <input
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="username"
          />
        </label>

        <div className="input">
          <div className="icon">
            <BsFillEnvelopeFill />
          </div>

          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />
        </div>

        <div className="inputUpload">
          <input
            id="uploadButton"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label className="inputB" htmlFor="uploadButton">
            <div className="icon2">
              <MdAddPhotoAlternate />
            </div>
            profile photo
          </label>
        </div>

        <div className="buttonBackReg">
          <button className="buttonLogin" onClick={onSignup}>
            Register Now
          </button>
        </div>

        <p>
          Do you already have an account ?&nbsp;&nbsp;&nbsp;{" "}
          <Link href="/login" className="sign">
            Login
          </Link>
        </p>
      </div>
    </article>
  )
}
